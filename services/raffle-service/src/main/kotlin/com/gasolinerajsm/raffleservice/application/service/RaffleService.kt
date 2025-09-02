package com.gasolinerajsm.raffleservice.application.service

import com.gasolinerajsm.raffleservice.adapter.RedemptionServiceClient
import com.gasolinerajsm.raffleservice.adapter.in.web.dto.RaffleVerificationDetailsDto
import com.gasolinerajsm.raffleservice.config.RaffleProperties
import com.gasolinerajsm.raffleservice.domain.model.Raffle
import com.gasolinerajsm.raffleservice.domain.model.RaffleEntry
import com.gasolinerajsm.raffleservice.domain.model.RaffleStatus
import com.gasolinerajsm.raffleservice.domain.model.RaffleWinner
import com.gasolinerajsm.raffleservice.domain.service.MerkleTree
import com.gasolinerajsm.raffleservice.repository.RaffleEntryRepository
import com.gasolinerajsm.raffleservice.repository.RaffleRepository
import com.gasolinerajsm.raffleservice.repository.RaffleWinnerRepository
import io.micrometer.core.instrument.MeterRegistry
import jakarta.validation.constraints.Pattern
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers
import reactor.util.retry.Retry
import java.math.BigInteger
import java.time.Duration
import java.time.LocalDateTime
import java.util.UUID

@Service
class RaffleService(
    private val raffleRepository: RaffleRepository,
    private val raffleEntryRepository: RaffleEntryRepository,
    private val raffleWinnerRepository: RaffleWinnerRepository,
    private val webClientBuilder: WebClient.Builder,
    private val redemptionServiceClient: RedemptionServiceClient,
    private val raffleProperties: RaffleProperties,
    private val meterRegistry: MeterRegistry
) {

    private val logger = LoggerFactory.getLogger(RaffleService::class.java)

    // ... existing methods ...

    fun getVerificationDetails(raffleId: Long): Mono<RaffleVerificationDetailsDto> {
        val raffleMono = Mono.fromCallable { raffleRepository.findById(raffleId) }
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap { optionalRaffle ->
                if (optionalRaffle.isPresent) Mono.just(optionalRaffle.get()) else Mono.error(NoSuchElementException("Raffle not found"))
            }
            .filter { it.status == RaffleStatus.DRAWN }
            .switchIfEmpty(Mono.error(IllegalStateException("Raffle has not been drawn yet.")))

        val entriesMono = Mono.fromCallable { raffleEntryRepository.findByRaffleId(raffleId) }
            .subscribeOn(Schedulers.boundedElastic())

        return Mono.zip(raffleMono, entriesMono)
            .map { tuple ->
                val raffle = tuple.t1
                val entries = tuple.t2
                RaffleVerificationDetailsDto(
                    raffleId = raffle.id.toString(),
                    serverSeedHash = raffle.serverSeedHash ?: "", // Assuming serverSeedHash is stored
                    clientSeed = raffle.clientSeed, // Assuming clientSeed is stored
                    publicSeed = raffle.externalSeed ?: "",
                    finalCombinedSeed = "", // This should be calculated or stored
                    winnerId = raffle.winnerEntryId ?: "",
                    merkleRoot = raffle.merkleRoot ?: "",
                    entries = entries.map { it.userId.toString() } // Or another unique identifier
                )
            }
    }

    // ... rest of the existing methods ...
}
