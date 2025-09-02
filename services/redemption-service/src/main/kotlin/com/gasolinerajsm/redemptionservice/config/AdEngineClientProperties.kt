package com.gasolinerajsm.redemptionservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "ad-engine.client")
data class AdEngineClientProperties(
    val baseUrl: String = "https://ad-engine:8080", // Default value
    val retryBackoffPeriodMs: Long = 1000, // Default 1 second
    val retryMaxAttempts: Int = 3 // Default 3 attempts
)