package com.gasolinerajsm.apigateway.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component
import java.net.URI

@Component
@ConfigurationProperties(prefix = "gateway")
data class GatewayProperties(
    val authServiceUri: URI = URI.create("http://auth-service:8081"),
    val couponServiceUri: URI = URI.create("http://coupon-service:8084"),
    val stationServiceUri: URI = URI.create("http://station-service:8083"),
    val adEngineServiceUri: URI = URI.create("http://ad-engine:8082"),
    val raffleServiceUri: URI = URI.create("http://raffle-service:8085"),
    val healthCheckUri: URI = URI.create("http://localhost:8080"),

    val authServicePath: String = "/auth/**",
    val couponServicePath: String = "/coupons/**",
    val stationServicePath: String = "/stations/**",
    val adEngineServicePaths: List<String> = listOf("/ads/**", "/campaigns/**"),
    val raffleServicePath: String = "/raffles/**",
    val healthCheckPath: String = "/actuator/health",

    val adEngineCircuitBreakerName: String = "ad-engine-cb",
    val adEngineFallbackUri: URI = URI.create("forward:/fallback/ads"),

    val authRateLimiterReplenishRate: Int = 1,
    val authRateLimiterBurstCapacity: Int = 2
)