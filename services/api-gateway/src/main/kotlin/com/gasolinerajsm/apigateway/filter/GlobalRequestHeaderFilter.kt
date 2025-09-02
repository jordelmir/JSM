package com.gasolinerajsm.apigateway.filter

import com.gasolinerajsm.apigateway.config.GatewayProperties // New import
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * A global filter that adds the 'X-Gateway' header to all outgoing requests.
 * This header can be used by downstream services to identify requests coming from the API Gateway.
 */
@Component
class GlobalRequestHeaderFilter(private val gatewayProperties: GatewayProperties) : GlobalFilter, Ordered { // Inject GatewayProperties

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request.mutate()
            .header("X-Gateway", gatewayProperties.gatewayId) // Use configurable gatewayId
            .build()
        return chain.filter(exchange.mutate().request(request).build())
    }

    override fun getOrder(): Int {
        return Ordered.LOWEST_PRECEDENCE // Ensure this filter runs after others
    }
}
