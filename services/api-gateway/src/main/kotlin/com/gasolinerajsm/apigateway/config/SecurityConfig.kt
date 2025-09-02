package com.gasolinerajsm.apigateway.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource

/**
 * Security configuration for API Gateway
 */
@Configuration
@EnableWebFluxSecurity
class SecurityConfig(private val corsProperties: CorsProperties) { // Inject CorsProperties

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http
            .csrf { csrf -> csrf.disable() }
            .cors { cors -> cors.configurationSource(corsConfigurationSource()) }
            .authorizeExchange { exchanges ->
                exchanges
                    // Public endpoints
                    .pathMatchers("/auth/**").permitAll()
                    .pathMatchers("/actuator/health").permitAll()
                    .pathMatchers("/fallback/**").permitAll()

                    // Protected endpoints
                    .pathMatchers("/coupons/**").authenticated()
                    .pathMatchers("/stations/**").authenticated()
                    .pathMatchers("/ads/**").authenticated()
                    .pathMatchers("/campaigns/**").hasRole("ADMIN")
                    .pathMatchers("/raffles/**").authenticated()

                    // Default: require authentication
                    .anyExchange().authenticated()
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { }
            }
            .build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOriginPatterns = corsProperties.allowedOrigins // Use configurable origins
        configuration.allowedMethods = corsProperties.allowedMethods
        configuration.allowedHeaders = corsProperties.allowedHeaders
        configuration.allowCredentials = corsProperties.allowCredentials
        configuration.maxAge = corsProperties.maxAge // Use configurable maxAge

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}