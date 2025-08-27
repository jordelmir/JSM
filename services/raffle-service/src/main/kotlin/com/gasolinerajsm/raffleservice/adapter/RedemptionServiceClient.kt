package com.gasolinerajsm.raffleservice.adapter

import com.gasolinerajsm.raffleservice.dto.PointIdResponse
import com.gasolinerajsm.raffleservice.dto.PointIdsByPeriodResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Component
class RedemptionServiceClient(
    private val webClientBuilder: WebClient.Builder,
    @Value("\${redemption-service.url}") private val redemptionServiceBaseUrl: String
) {

    private val logger = LoggerFactory.getLogger(RedemptionServiceClient::class.java)
    private val webClient = webClientBuilder.baseUrl(redemptionServiceBaseUrl).build()

    fun getPointIdsByPeriod(period: String): Mono<List<PointIdResponse>> {
        logger.info("Fetching point IDs for period {} from Redemption Service", period)
        return webClient.get()
            .uri("/api/v1/points/by-period?period={period}", period) // Example API path
            .retrieve()
            .bodyToMono(PointIdsByPeriodResponse::class.java)
            .map { it.pointIds }
            .doOnError { e -> logger.error("Error fetching point IDs for period {}: {}", period, e.message) }
            .onErrorResume { Mono.empty() } // Return empty list on error
    }
}
