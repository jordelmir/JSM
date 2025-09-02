package com.gasolinerajsm.authservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "jwt")
data class JwtProperties(
    val secret: String,
    val expirationMs: Long = 3600000, // 1 hour
    val refreshExpirationMs: Long = 86400000 // 24 hours
)