package com.gasolinerajsm.redemptionservice.adapter.in.web

import com.gasolinerajsm.redemptionservice.exception.InvalidQrException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.time.LocalDateTime
import com.gasolinerajsm.shared.api.ErrorResponse // New import
import io.micrometer.core.instrument.MeterRegistry // New import
import jakarta.servlet.http.HttpServletRequest // New import

@ControllerAdvice
class RedemptionExceptionHandler(private val meterRegistry: MeterRegistry) { // Inject MeterRegistry

    private val logger = LoggerFactory.getLogger(RedemptionExceptionHandler::class.java)

    @ExceptionHandler(InvalidQrException::class)
    fun handleInvalidQrException(ex: InvalidQrException, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        meterRegistry.counter("http_requests_errors_total", "status", "400", "exception", "InvalidQrException").increment()
        logger.warn("Invalid QR request: {} for path {} {}", ex.message, request.method, request.requestURI)
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = "Bad Request",
            message = ex.message ?: "Invalid QR code provided",
            path = request.requestURI,
            method = request.method
        )
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        meterRegistry.counter("http_requests_errors_total", "status", "500", "exception", ex.javaClass.simpleName).increment()
        logger.error("An unexpected error occurred in Redemption Service: {} for path {} {}", ex.message, request.method, request.requestURI, ex)
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            error = "Internal Server Error",
            message = "An unexpected error occurred. Please try again later.",
            path = request.requestURI,
            method = request.method
        )
        return ResponseEntity(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
