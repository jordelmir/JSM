package com.gasolinerajsm.authservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding // New import

/**
 * Configuration properties for OTP (One-Time Password) settings.
 * These properties are typically loaded from application configuration files (e.g., application.yml, application.properties).
 * @property expirationMinutes The duration in minutes after which an OTP expires. Defaults to 5 minutes.
 * @property length The length of the generated OTP code. Defaults to 6 digits.
 * @property maxAttempts The maximum number of failed OTP verification attempts before a lockout occurs. Defaults to 5 attempts.
 * @property lockoutMinutes The duration in minutes for which a user is locked out after exceeding maxAttempts. Defaults to 15 minutes.
 */
@ConstructorBinding // New annotation
@ConfigurationProperties(prefix = "otp")
data class OtpProperties(
    val expirationMinutes: Long = 5,
    val length: Int = 6,
    val maxAttempts: Int = 5,
    val lockoutMinutes: Long = 15
)