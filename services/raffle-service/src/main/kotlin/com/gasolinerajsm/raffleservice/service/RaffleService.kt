package com.gasolinerajsm.raffleservice.service

import com.gasolinerajsm.raffleservice.adapter.RedemptionServiceClient // Import new client
import com.gasolinerajsm.raffleservice.config.RaffleProperties // Import new properties
import com.gasolinerajsm.raffleservice.model.Raffle
import com.gasolinerajsm.raffleservice.model.RaffleEntry
import com.gasolinerajsm.raffleservice.model.RaffleStatus
import com.gasolinerajsm.raffleservice.model.RaffleWinner
import com.gasolinerajsm.raffleservice.repository.RaffleEntryRepository
import com.gasolinerajsm.raffleservice.repository.RaffleRepository
import com.gasolinerajsm.raffleservice.repository.RaffleWinnerRepository
import com.gasolinerajsm.raffleservice.util.MerkleTreeGenerator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import jakarta.validation.constraints.Pattern // Import Pattern
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers // Import Schedulers
import reactor.util.retry.Retry // Import Retry
import java.math.BigInteger
import java.time.Duration // Import Duration
import java.time.LocalDateTime
import java.util.UUID // Import UUID for userId

import io.micrometer.core.instrument.MeterRegistry // Import Micrometer

/**
 * Service responsible for managing raffles, including closing periods, executing draws,
 * and interacting with external services for randomness.
 *
 * This service leverages reactive programming with Project Reactor for non-blocking operations.
 */
@Service
class RaffleService(
    /**
     * Repository for Raffle entities.
     */
    private val raffleRepository: RaffleRepository,
    /**
     * Repository for RaffleEntry entities.
     */
    private val raffleEntryRepository: RaffleEntryRepository,
    /**
     * Repository for RaffleWinner entities.
     */
    private val raffleWinnerRepository: RaffleWinnerRepository,
    /**
     * WebClient.Builder for creating reactive HTTP clients.
     */
    private val webClientBuilder: WebClient.Builder,
    /**
     * Client for interacting with the Redemption Service.
     */
    private val redemptionServiceClient: RedemptionServiceClient,
    /**
     * Configuration properties for raffles.
     */
    private val raffleProperties: RaffleProperties,
    /**
     * Meter registry for collecting metrics.
     */
    private val meterRegistry: MeterRegistry
) {

    private val logger = LoggerFactory.getLogger(RaffleService::class.java)

    @Transactional
    fun closeRafflePeriod(@Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Period must be in YYYY-MM-DD format") period: String): Mono<Raffle> {
        logger.info("Attempting to close raffle period: {}", period)

        return Mono.fromCallable { raffleRepository.findByPeriod(period) } // Blocking call wrapped
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap { existingRaffle ->
                if (existingRaffle != null && existingRaffle.status != RaffleStatus.OPEN) {
                    Mono.error(IllegalStateException("Raffle for period $period is already closed or drawn."))
                } else {
                    redemptionServiceClient.getPointIdsByPeriod(period)
                        .switchIfEmpty(Mono.error(IllegalStateException("No points found for period $period. Cannot close raffle.")))
                        .flatMap { pointIdsWithUsers ->
                            if (pointIdsWithUsers.isNullOrEmpty()) {
                                Mono.error(IllegalStateException("No points found for period $period. Cannot close raffle."))
                            }
                            logger.info("Fetched {} point IDs for period {}", pointIdsWithUsers.size, period)

                            val merkleRoot = MerkleTreeGenerator.generateMerkleRoot(pointIdsWithUsers.map { it.pointId })
                            logger.info("Generated Merkle Root for period {}: {}", period, merkleRoot)

                            val raffle = existingRaffle ?: Raffle(period = period, merkleRoot = merkleRoot)
                            raffle.merkleRoot = merkleRoot // Update if already exists
                            raffle.status = RaffleStatus.CLOSED

                            Mono.fromCallable { raffleRepository.save(raffle) } // Blocking call wrapped
                                .subscribeOn(Schedulers.boundedElastic())
                                .doOnSuccess { savedRaffle ->
                                    logger.info("Raffle for period {} closed with ID: {}", period, savedRaffle.id)
                                    meterRegistry.counter("raffle.closed.total").increment()
                                    meterRegistry.counter("raffle.closed.period", "period", period).increment()

                                    // Save raffle entries with user IDs
                                    pointIdsWithUsers.forEach { pointIdResponse ->
                                        Mono.fromCallable { raffleEntryRepository.save(RaffleEntry(
                                            raffleId = savedRaffle.id!!,
                                            pointId = pointIdResponse.pointId,
                                            userId = pointIdResponse.userId // Save user ID with entry
                                        ))}.subscribeOn(Schedulers.boundedElastic()).subscribe() // Save each entry asynchronously
                                    }
                                    logger.info("Saved {} raffle entries for raffle ID: {}", pointIdsWithUsers.size, savedRaffle.id)
                                }
                        }
                }
            }
    }

    @Transactional
    fun executeRaffleDraw(raffleId: Long): Mono<RaffleWinner> { // Change return type to Mono
        logger.info("Attempting to execute draw for raffle ID: {}", raffleId)
        return Mono.fromCallable { raffleRepository.findById(raffleId).orElse(null) } // Blocking call wrapped
            .subscribeOn(Schedulers.boundedElastic())
            .switchIfEmpty(Mono.error(IllegalArgumentException("Raffle with ID $raffleId not found.")))
            .flatMap { raffle ->
                if (raffle.status != RaffleStatus.CLOSED) {
                    Mono.error(IllegalStateException("Raffle with ID $raffleId is not in CLOSED status. Current status: ${raffle.status}"))
                } else {
                    getBitcoinBlockhash()
                        .switchIfEmpty(Mono.error(IllegalStateException("Could not retrieve external seed for draw.")))
                        .flatMap { externalSeed ->
                            logger.info("Retrieved external seed for raffle ID {}: {}", raffleId, externalSeed)

                            Mono.fromCallable { raffleEntryRepository.findByRaffleId(raffleId) } // Blocking call wrapped
                                .subscribeOn(Schedulers.boundedElastic())
                                .flatMap { entries ->
                                    if (entries.isEmpty()) {
                                        Mono.error(IllegalStateException("No entries found for raffle ID $raffleId. Cannot draw winner."))
                                    } else {
                                        val winnerIndex = selectWinnerDeterministically(raffle.merkleRoot, externalSeed, entries.size)
                                        val winningEntry = entries[winnerIndex]
                                        logger.info("Selected winning entry for raffle ID {}: Index {}, Point ID \n", raffleId, winnerIndex, winningEntry.pointId)

                                        val winner = RaffleWinner(
                                            raffleId = raffle.id!!,
                                            userId = winningEntry.userId,
                                            winningPointId = winningEntry.pointId,
                                            prize = raffleProperties.defaultPrize // Use configurable prize
                                        )
                                        Mono.fromCallable { raffleWinnerRepository.save(winner) } // Blocking call wrapped
                                            .subscribeOn(Schedulers.boundedElastic())
                                            .doOnSuccess { savedWinner ->
                                                raffle.status = RaffleStatus.DRAWN
                                                raffle.drawAt = LocalDateTime.now()
                                                raffle.externalSeed = externalSeed
                                                raffle.winnerEntryId = winningEntry.pointId
                                                Mono.fromCallable { raffleRepository.save(raffle) } // Blocking call wrapped
                                                    .subscribeOn(Schedulers.boundedElastic()).subscribe() // Save raffle status asynchronously
                                                logger.info("Raffle ID {} drawn. Winner: \n", raffleId, savedWinner.winningPointId)
                                            }
                                    }
                                }
                        }
                }
            }
            .doOnError { e -> meterRegistry.counter("raffle.draw.failed.total").increment() }
    }

    private fun getBitcoinBlockhash(): Mono<String> {
        // Using a public API for Bitcoin block hash
        val webClient = webClientBuilder.baseUrl("https://blockchain.info").build()
        return webClient.get()
            .uri("/q/latesthash")
            .retrieve()
            .bodyToMono(String::class.java)
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(2)) // Retry 3 times with 2s backoff
                .doBeforeRetry { retrySignal -> logger.warn("Retrying Bitcoin block hash fetch: {}", retrySignal) })
            .doOnError { e -> logger.error("Error fetching Bitcoin block hash: {}", e.message) }
            .onErrorResume { Mono.error(IllegalStateException("Failed to retrieve external seed after multiple retries.", it)) } // Throw specific error
    }

    private fun selectWinnerDeterministically(merkleRoot: String, seed: String, numberOfEntries: Int): Int {
        // Combine Merkle Root and external seed
        val combinedHash = MerkleTreeGenerator.sha256(merkleRoot + seed)
        
        // Convert hash to a large integer
        val bigInt = BigInteger(combinedHash, 16)

        // Use modulo to get a deterministic index
        return bigInt.mod(BigInteger.valueOf(numberOfEntries.toLong())).toInt()
    }
}