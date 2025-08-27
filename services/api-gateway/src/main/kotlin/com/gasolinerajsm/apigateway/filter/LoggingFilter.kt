package com.gasolinerajsm.apigateway.filter

import io.micrometer.tracing.Tracer
import org.slf4j.LoggerFactory
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.time.LocalDateTime
import java.util.UUID

/**
 * Global filter for logging requests and responses, including distributed tracing IDs.
 */
@Component
class LoggingFilter(private val tracer: Tracer) : GlobalFilter, Ordered {

    private val logger = LoggerFactory.getLogger(LoggingFilter::class.java)

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val span = tracer.currentSpan()
        val traceId = span?.context()?.traceId()
        val spanId = span?.context()?.spanId()

        val correlationId = UUID.randomUUID().toString()

        // Add correlation ID to request headers
        val mutatedRequest = exchange.request.mutate()
            .header("X-Correlation-ID", correlationId)
            .build()

        val mutatedExchange = exchange.mutate()
            .request(mutatedRequest)
            .build()

        val startTime = System.currentTimeMillis()

        logger.info(
            "Gateway Request - TraceId: {}, SpanId: {}, CorrelationId: {}, Method: {}, URI: {}, Headers: {}, Timestamp: {}",
            traceId ?: "N/A",
            spanId ?: "N/A",
            correlationId,
            mutatedRequest.method,
            mutatedRequest.uri,
            mutatedRequest.headers.toSingleValueMap(),
            LocalDateTime.now()
        )

        return chain.filter(mutatedExchange)
            .doOnSuccess { response ->
                val endTime = System.currentTimeMillis()
                val duration = endTime - startTime

                logger.info(
                    "Gateway Response - TraceId: {}, SpanId: {}, CorrelationId: {}, Status: {}, Duration: {}ms, Timestamp: {}",
                    traceId ?: "N/A",
                    spanId ?: "N/A",
                    correlationId,
                    response.statusCode,
                    duration,
                    LocalDateTime.now()
                )
            }
            .doOnError { error ->
                val endTime = System.currentTimeMillis()
                val duration = endTime - startTime

                logger.error(
                    "Gateway Error - TraceId: {}, SpanId: {}, CorrelationId: {}, Error: {}, Duration: {}ms, Timestamp: {}",
                    traceId ?: "N/A",
                    spanId ?: "N/A",
                    correlationId,
                    error.message,
                    duration,
                    LocalDateTime.now(),
                    error
                )
            }
    }

    override fun getOrder(): Int {
        return Ordered.HIGHEST_PRECEDENCE
    }
}