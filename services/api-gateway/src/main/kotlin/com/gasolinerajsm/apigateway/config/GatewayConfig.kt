package com.gasolinerajsm.apigateway.config

import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import java.net.URI

/**
 * Spring Cloud Gateway configuration for routing requests to microservices
 */
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter
import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import java.net.URI
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver
import reactor.core.publisher.Mono

/**
 * Spring Cloud Gateway configuration for routing requests to microservices
 */
@Configuration
class GatewayConfig(private val gatewayProperties: GatewayProperties) { // Inject GatewayProperties

    @Bean
    fun ipKeyResolver(): KeyResolver {
        return KeyResolver { exchange -> Mono.just(exchange.request.remoteAddress?.address?.hostAddress ?: "anonymous") }
    }

    @Bean
    fun redisRateLimiter(): RedisRateLimiter {
        return RedisRateLimiter(gatewayProperties.authRateLimiterReplenishRate, gatewayProperties.authRateLimiterBurstCapacity) // Use properties
    }

    @Bean
    fun customRouteLocator(builder: RouteLocatorBuilder): RouteLocator {
        return builder.routes()
            // Auth Service Routes
            .route("auth-service") { r ->
                r.path(gatewayProperties.authServicePath)
                    .filters { f ->
                        f.addRequestHeader("X-Gateway", "api-gateway")
                        f.requestRateLimiter { rl -> // Apply rate limiter
                            rl.setRateLimiter(redisRateLimiter())
                            rl.setKeyResolver(ipKeyResolver())
                        }
                    }
                    .uri(gatewayProperties.authServiceUri)
            }

            // Coupon Service Routes
            .route("coupon-service") { r ->
                r.path(gatewayProperties.couponServicePath)
                    .filters { f ->
                        f.addRequestHeader("X-Gateway", "api-gateway")
                    }
                    .uri(gatewayProperties.couponServiceUri)
            }

            // Station Service Routes
            .route("station-service") { r ->
                r.path(gatewayProperties.stationServicePath)
                    .filters { f ->
                        f.addRequestHeader("X-Gateway", "api-gateway")
                    }
                    .uri(gatewayProperties.stationServiceUri)
            }

            // Ad Engine Routes (when available)
            .route("ad-engine") { r ->
                r.path(*gatewayProperties.adEngineServicePaths.toTypedArray()) // Use vararg for paths
                    .filters { f ->
                        f.addRequestHeader("X-Gateway", "api-gateway")
                        f.circuitBreaker { cb ->
                            cb.name = gatewayProperties.adEngineCircuitBreakerName
                            cb.fallbackUri = gatewayProperties.adEngineFallbackUri
                        }
                    }
                    .uri(gatewayProperties.adEngineServiceUri)
            }

            // Raffle Service Routes (when available)
            .route("raffle-service") { r ->
                r.path(gatewayProperties.raffleServicePath)
                    .filters { f ->
                        f.addRequestHeader("X-Gateway", "api-gateway")
                    }
                    .uri(gatewayProperties.raffleServiceUri)
            }

            // Health Check Routes (allow direct access)
            .route("health-checks") { r ->
                r.path(gatewayProperties.healthCheckPath)
                    .filters { f ->
                        f.addRequestHeader("X-Health-Check", "gateway")
                    }
                    .uri(gatewayProperties.healthCheckUri)
            }

            .build()
    }
}