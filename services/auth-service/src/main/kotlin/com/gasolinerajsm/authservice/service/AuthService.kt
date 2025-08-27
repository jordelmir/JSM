package com.gasolinerajsm.authservice.service

import com.gasolinerajsm.authservice.config.OtpProperties
import com.gasolinerajsm.authservice.dto.TokenResponse
import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.concurrent.TimeUnit

/**
 * Service responsible for authentication operations including OTP generation,
 * verification, and token issuance.
 *
 * This service follows hexagonal architecture principles by depending on
 * abstractions (ports) rather than concrete implementations.
 */
@Service
class AuthService(
    private val redisTemplate: StringRedisTemplate,
    private val jwtService: JwtService,
    private val userService: UserService,
    private val otpProperties: OtpProperties
) {

    private val logger = LoggerFactory.getLogger(AuthService::class.java)

    companion object {
        private const val OTP_PREFIX = "otp:"
        private const val OTP_ATTEMPTS_PREFIX = "otp_attempts:"
        private const val OTP_LENGTH = 6
        private const val MIN_OTP_VALUE = 100000
        private const val MAX_OTP_VALUE = 999999
        private val PHONE_NUMBER_REGEX = "^\\+[1-9]\\d{1,14}$".toRegex()
    }

    /**
     * Generates and stores an OTP for the given phone number.
     * In production, this should trigger SMS sending.
     *
     * @param phone The phone number to send OTP to
     * @throws IllegalArgumentException if phone number is invalid
     */
    fun sendOtp(phone: String) {
        require(phone.isNotBlank() && phone.matches(PHONE_NUMBER_REGEX)) {
            "Invalid phone number format. It must be in E.164 format (e.g., +1234567890)."
        }

        val otp = generateSecureOtp()
        val redisKey = "$OTP_PREFIX$phone"

        redisTemplate.opsForValue().set(redisKey, otp, otpProperties.expirationMinutes, TimeUnit.MINUTES)

        logger.info("Generated OTP for phone number ending in {}", phone.takeLast(4))

        // TODO: Replace with actual SMS service integration
        // otpSender.send(phone, "Your Gasolinera JSM code is: $otp")
        logger.debug("Mock OTP for $phone: $otp") // Remove in production
    }

    /**
     * Verifies the provided OTP and issues JWT tokens if valid.
     *
     * @param phone The phone number associated with the OTP
     * @param code The OTP code to verify
     * @return TokenResponse containing access and refresh tokens
     * @throws IllegalArgumentException if OTP is invalid or expired
     */
    fun verifyOtpAndIssueTokens(phone: String, code: String): TokenResponse {
        val attemptsKey = "$OTP_ATTEMPTS_PREFIX$phone"
        val attempts = redisTemplate.opsForValue().get(attemptsKey)?.toInt() ?: 0

        if (attempts >= otpProperties.maxAttempts) {
            throw IllegalStateException("Too many failed attempts. Please try again later.")
        }

        require(phone.isNotBlank()) { "Phone number cannot be blank" }
        require(code.isNotBlank()) { "OTP code cannot be blank" }

        val redisKey = "$OTP_PREFIX$phone"
        val storedOtp = redisTemplate.opsForValue().get(redisKey)

        if (storedOtp == null || storedOtp != code) {
            redisTemplate.opsForValue().increment(attemptsKey)
            redisTemplate.expire(attemptsKey, otpProperties.lockoutMinutes, TimeUnit.MINUTES)
            logger.warn("Invalid OTP attempt for phone number ending in {}", phone.takeLast(4))
            throw IllegalArgumentException("Invalid or expired OTP")
        }

        logger.info("Successfully verified OTP for phone number ending in {}", phone.takeLast(4))

        // Find or create user
        val user = userService.findOrCreateUser(phone)

        // Generate tokens
        val accessToken = jwtService.generateAccessToken(user.id.toString())
        val refreshToken = jwtService.generateRefreshToken(user.id.toString())

        // Clean up OTP and attempts counter
        redisTemplate.delete(redisKey)
        redisTemplate.delete(attemptsKey)

        logger.info("Issued access and refresh tokens for userId: {}", user.id)

        return TokenResponse(accessToken, refreshToken)
    }

    /**
     * Generates a cryptographically secure OTP.
     *
     * @return A 6-digit OTP as string
     */
    private fun generateSecureOtp(): String {
        val secureRandom = SecureRandom()
        val otp = secureRandom.nextInt(MIN_OTP_VALUE, MAX_OTP_VALUE + 1)
        return otp.toString()
    }
}