package com.gasolinerajsm.apigateway.config

import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import java.net.URI
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver
import reactor.core.publisher.Mono

/**
 * Spring Cloud Gateway configuration for routing requests to microservices.
 * This class defines routing rules, applies various filters like rate limiting and circuit breakers,
 * and integrates with GatewayProperties for service URIs and paths.
 */
package com.gasolinerajsm.apigateway.config

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import reactor.core.publisher.Mono

/**
 * Provides beans for gateway functionality like Rate Limiting.
 * Route definitions have been moved to application.yml for better configuration management.
 */
@Configuration
class GatewayConfig {

    /**
     * Defines a KeyResolver bean that extracts the client's IP address for rate limiting.
     * This bean is referenced by name in application.yml (e.g., '#{@ipKeyResolver}').
     * @return A KeyResolver instance.
     */
    @Bean
    fun ipKeyResolver(): KeyResolver {
        return KeyResolver { exchange -> Mono.just(exchange.request.remoteAddress?.address?.hostAddress ?: "anonymous") }
    }

    /**
     * Defines a default RedisRateLimiter bean.
     * The actual configuration (replenishRate, burstCapacity) is now defined per-route in application.yml.
     * @return A RedisRateLimiter instance.
     */
    @Bean
    fun redisRateLimiter(): RedisRateLimiter {
        // Default values, can be overridden per-route in YAML config
        return RedisRateLimiter(10, 20)
    }
}
