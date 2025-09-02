package com.gasolinerajsm.authservice.exception

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.time.LocalDateTime

data class ErrorResponse(
    val timestamp: LocalDateTime,
    val status: Int,
    val error: String,
    val message: String,
    val path: String, // Make path non-nullable
    val method: String // Add method
)

import io.micrometer.core.instrument.MeterRegistry // Import MeterRegistry
import org.springframework.web.context.request.RequestContextHolder // New import
import org.springframework.web.context.request.ServletRequestAttributes // New import

@ControllerAdvice
class GlobalExceptionHandler(
    private val meterRegistry: MeterRegistry // Inject MeterRegistry
) {

    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val request = (RequestContextHolder.currentRequestAttributes() as ServletRequestAttributes).request
        meterRegistry.counter("http_requests_errors_total", "status", "400", "exception", "MethodArgumentNotValidException").increment()
        val errors = ex.bindingResult.fieldErrors
            .map { it.defaultMessage }
            .filterNotNull()
            .joinToString("; ")
        logger.warn("Validation error: {} for path {} {}", errors, request.method, request.requestURI)
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = "Validation Error",
            message = errors,
            path = request.requestURI,
            method = request.method
        )
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(ex: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        val request = (RequestContextHolder.currentRequestAttributes() as ServletRequestAttributes).request
        meterRegistry.counter("http_requests_errors_total", "status", "400", "exception", "IllegalArgumentException").increment()
        logger.warn("Illegal argument: {} for path {} {}", ex.message, request.method, request.requestURI)
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = "Bad Request",
            message = ex.message ?: "Invalid argument provided",
            path = request.requestURI,
            method = request.method
        )
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<ErrorResponse> {
        val request = (RequestContextHolder.currentRequestAttributes() as ServletRequestAttributes).request
        meterRegistry.counter("http_requests_errors_total", "status", "500", "exception", ex.javaClass.simpleName).increment()
        logger.error("An unexpected error occurred: {} for path {} {}", ex.message, request.method, request.requestURI, ex)
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
