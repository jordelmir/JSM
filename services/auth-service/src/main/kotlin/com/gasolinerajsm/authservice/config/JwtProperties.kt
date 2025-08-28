package com.gasolinerajsm.authservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "jwt")
data class JwtProperties(
    var secret: String,
    var accessTokenExpirationMs: Long = 15 * 60 * 1000L, // Default 15 minutes
    var refreshTokenExpirationMs: Long = 7 * 24 * 60 * 60 * 1000L // Default 7 days
)