package com.gasolinerajsm.authservice.application.service

import com.gasolinerajsm.authservice.config.OtpProperties
import com.gasolinerajsm.authservice.dto.TokenResponse
import com.gasolinerajsm.authservice.application.port.out.OtpSender // New import
import com.gasolinerajsm.authservice.util.PhoneNumberValidator
import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.concurrent.TimeUnit

@Service
class AuthService(
    private val redisTemplate: StringRedisTemplate,
    private val jwtService: JwtService,
    private val userService: UserService,
    private val otpProperties: OtpProperties,
    private val otpSender: OtpSender // New dependency
) {

    private val logger = LoggerFactory.getLogger(AuthService::class.java)

    companion object {
        private const val OTP_PREFIX = "otp:"
        private const val OTP_ATTEMPTS_PREFIX = "otp_attempts:"
        private const val OTP_LENGTH = 6
        private const val MIN_OTP_VALUE = 100000
        private const val MAX_OTP_VALUE = 999999
    }

    fun sendOtp(phone: String) {
        require(PhoneNumberValidator.isValidE164(phone)) {
            "Invalid phone number format. It must be in E.164 format (e.g., +1234567890)."
        }

        val otp = generateSecureOtp()
        val redisKey = "$OTP_PREFIX$phone"

        redisTemplate.opsForValue().set(redisKey, otp, otpProperties.expirationMinutes, TimeUnit.MINUTES)

        logger.info("Generated OTP for phone number ending in {}", phone.takeLast(4))

        otpSender.send(phone, otp) // Use the injected OtpSender
    }

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

        val user = userService.findOrCreateUser(phone)

        val accessToken = jwtService.generateAccessToken(user.id.toString())
        val refreshToken = jwtService.generateRefreshToken(user.id.toString())

        redisTemplate.delete(redisKey)
        redisTemplate.delete(attemptsKey)

        logger.info("Issued access and refresh tokens for userId: {}", user.id)

        return TokenResponse(accessToken, refreshToken)
    }

    fun refreshAccessToken(refreshToken: String): TokenResponse {
        if (!jwtService.isRefreshTokenValid(refreshToken)) {
            throw BadCredentialsException("Invalid or expired refresh token")
        }

        // Invalidate the used refresh token
        jwtService.blacklistToken(refreshToken)

        val userId = jwtService.extractSubjectFromRefreshToken(refreshToken)

        // Issue a new pair of tokens
        val newAccessToken = jwtService.generateAccessToken(userId)
        val newRefreshToken = jwtService.generateRefreshToken(userId)

        logger.info("Refreshed tokens for userId: {}", userId)

        return TokenResponse(newAccessToken, newRefreshToken)
    }

    private fun generateSecureOtp(): String {
        val secureRandom = SecureRandom()
        val otp = secureRandom.nextInt(MIN_OTP_VALUE, MAX_OTP_VALUE + 1)
        return otp.toString()
    }
}
