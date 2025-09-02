package com.gasolinerajsm.raffleservice.adapter

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

/**
 * Data Transfer Object (DTO) representing a single point ID.
 * @property pointId The unique identifier of the point.
 */
data class PointIdResponse(
    val pointId: String
)

/**
 * Data Transfer Object (DTO) representing a list of point IDs for a given period.
 * @property pointIds A list of PointIdResponse objects.
 */
data class PointIdsByPeriodResponse(
    val pointIds: List<PointIdResponse>
)

/**
 * Client for interacting with the Redemption Service.
 * This component uses WebClient to make HTTP requests to the Redemption Service API.
 */
@Component
class RedemptionServiceClient(
    private val webClientBuilder: WebClient.Builder,
    @Value("\${redemption-service.url}") private val redemptionServiceBaseUrl: String
) {

    private val logger = LoggerFactory.getLogger(RedemptionServiceClient::class.java)
    private val webClient = webClientBuilder.baseUrl(redemptionServiceBaseUrl).build()

    /**
     * Fetches a list of point IDs for a given period from the Redemption Service.
     * @param period The period for which to fetch point IDs.
     * @return A Mono that emits a list of PointIdResponse objects. Emits an empty Mono on error.
     */
    fun getPointIdsByPeriod(period: String): Mono<List<PointIdResponse>> {
        logger.info("Fetching point IDs for period {} from Redemption Service", period)
        return webClient.get()
            .uri("/points/by-period?period={period}", period) // Example API path
            .retrieve()
            .bodyToMono(PointIdsByPeriodResponse::class.java)
            .map { it.pointIds }
            .doOnError { e -> logger.error("Error fetching point IDs for period {}: {}", period, e.message) }
            .onErrorResume { Mono.empty() } // Return empty list on error
    }
}