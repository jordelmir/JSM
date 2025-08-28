package com.gasolinerajsm.apigateway.controller

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

/**
 * Fallback controller for circuit breaker patterns
 */
import org.springframework.web.server.ServerWebExchange // Import ServerWebExchange
import com.gasolinerajsm.apigateway.exception.ErrorResponse // Import ErrorResponse
import java.time.LocalDateTime // Ensure LocalDateTime is imported

@RestController
@RequestMapping("/fallback")
class FallbackController(private val exchange: ServerWebExchange) { // Inject ServerWebExchange

    private val logger = LoggerFactory.getLogger(FallbackController::class.java)

    /**
     * Fallback for ad engine service
     */
    @GetMapping("/ads")
    fun adEngineFallback(): ResponseEntity<ErrorResponse> {
        val path = exchange.request.path.value()
        val method = exchange.request.method?.name() ?: "UNKNOWN"
        logger.warn("Ad Engine service is unavailable for {} {}, returning fallback response", method, path)

        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.SERVICE_UNAVAILABLE.value(),
            error = "Service Unavailable",
            message = "Ad Engine service is temporarily unavailable. Please try again later.",
            path = path,
            method = method
        )

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse)
    }

    /**
     * Fallback for raffle service
     */
    @GetMapping("/raffles")
    fun raffleServiceFallback(): ResponseEntity<ErrorResponse> {
        val path = exchange.request.path.value()
        val method = exchange.request.method?.name() ?: "UNKNOWN"
        logger.warn("Raffle service is unavailable for {} {}, returning fallback response", method, path)

        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.SERVICE_UNAVAILABLE.value(),
            error = "Service Unavailable",
            message = "Raffle service is temporarily unavailable. Please try again later.",
            path = path,
            method = method
        )

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse)
    }

    /**
     * Generic fallback for any service
     */
    @GetMapping("/generic")
    fun genericFallback(): ResponseEntity<ErrorResponse> {
        val path = exchange.request.path.value()
        val method = exchange.request.method?.name() ?: "UNKNOWN"
        logger.warn("Service is unavailable for {} {}, returning generic fallback response", method, path)

        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.SERVICE_UNAVAILABLE.value(),
            error = "Service Unavailable",
            message = "Service is temporarily unavailable. Please try again later.",
            path = path,
            method = method
        )

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse)
    }
}

