package com.gasolinerajsm.redemptionservice.service

import com.fasterxml.jackson.core.JsonParseException // Import specific exception
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.exc.MismatchedInputException // Import specific exception
import com.gasolinerajsm.redemptionservice.exception.InvalidQrException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.KeyFactory
import java.security.PublicKey
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import java.time.Instant
import java.util.Base64
import org.slf4j.LoggerFactory

data class QrPayload(
    val s: String, // stationId
    val d: String, // dispenserId
    val n: String, // nonce
    val t: Long,   // timestamp
    val exp: Long  // expiration
)

import org.springframework.data.redis.core.StringRedisTemplate // Import StringRedisTemplate
import java.util.concurrent.TimeUnit // Import TimeUnit

import com.gasolinerajsm.redemptionservice.config.QrSecurityProperties // Import new properties

@Service
class QrSecurityService(
    @Value("\${qr.public.key}")
    private val qrPublicKeyPem: String,
    private val objectMapper: ObjectMapper,
    private val redisTemplate: StringRedisTemplate,
    private val qrSecurityProperties: QrSecurityProperties // Inject properties
) {

    private val logger = LoggerFactory.getLogger(QrSecurityService::class.java)

    companion object {
        private const val NONCE_PREFIX = "qr_nonce:"
        private const val RATE_LIMIT_PREFIX = "qr_rate_limit:"
        private const val MAX_REQUESTS_PER_MINUTE = 60
        private const val RATE_LIMIT_WINDOW_SECONDS = 60L
    }

    private val publicKey: PublicKey by lazy {
        val publicKeyPEM = qrPublicKeyPem
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replace("\n", "")
        val encoded = Base64.getDecoder().decode(publicKeyPEM)
        val keySpec = X509EncodedKeySpec(encoded)
        KeyFactory.getInstance(qrSecurityProperties.keyFactoryAlgorithm).generatePublic(keySpec)
    }

    fun validateAndParseToken(token: String): QrPayload {
        // Rate limiting check based on IP address or stationId/dispenserId from payload
        // For simplicity, let's use a generic key or stationId from the payload after parsing
        val rateLimitKey = "$RATE_LIMIT_PREFIX${token.substringBefore(".")}" // Using encoded payload as a key for rate limiting
        val currentRequests = redisTemplate.opsForValue().increment(rateLimitKey) ?: 1L

        if (currentRequests == 1L) {
            redisTemplate.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS, TimeUnit.SECONDS)
        } else if (currentRequests > MAX_REQUESTS_PER_MINUTE) {
            logger.warn("Rate limit exceeded for token: {}", token)
            throw InvalidQrException("Too many requests. Please try again later.")
        }

        val truncatedToken = if (token.length > 20) "${token.substring(0, 10)}...${token.substring(token.length - 10)}" else token
        logger.info("Validating QR token: {}", truncatedToken) // Log truncated token
        val parts = token.split(".")
        if (parts.size != 2) {
            logger.warn("Invalid QR token format: {}", token)
            throw InvalidQrException("Invalid QR token format")
        }

        val (encodedPayload, receivedSignatureBase64Url) = parts

        val decodedPayloadBytes = try {
            Base64.getUrlDecoder().decode(encodedPayload)
        } catch (e: IllegalArgumentException) {
            logger.warn("Invalid base64url encoding for payload: {}", encodedPayload)
            throw InvalidQrException("Invalid base64url encoding for payload")
        }

        val decodedReceivedSignatureBytes = try {
            Base64.getUrlDecoder().decode(receivedSignatureBase64Url)
        } catch (e: IllegalArgumentException) {
            logger.warn("Invalid base64url encoding for signature: {}", receivedSignatureBase64Url)
            throw InvalidQrException("Invalid base64url encoding for signature")
        }

        val signature = Signature.getInstance(qrSecurityProperties.signatureAlgorithm)
        signature.initVerify(publicKey)
        signature.update(decodedPayloadBytes)

        if (!signature.verify(decodedReceivedSignatureBytes)) {
            logger.warn("Invalid QR signature for payload: {}", truncatedToken)
            throw InvalidQrException("Invalid QR signature")
        }
        logger.info("QR signature verified successfully for token: {}", truncatedToken)

        val payloadJson = String(decodedPayloadBytes, Charsets.UTF_8)
        val qrPayload = try {
            objectMapper.readValue(payloadJson, QrPayload::class.java)
        } catch (e: JsonParseException) { // Catch specific JSON parsing error
            logger.warn("Invalid QR payload JSON format: {}", payloadJson, e)
            throw InvalidQrException("Invalid QR payload JSON format: ${e.message}")
        } catch (e: MismatchedInputException) { // Catch specific JSON mapping error
            logger.warn("Invalid QR payload JSON structure: {}", payloadJson, e)
            throw InvalidQrException("Invalid QR payload JSON structure: ${e.message}")
        } catch (e: Exception) { // Catch any other unexpected exceptions
            logger.warn("Unexpected error parsing QR payload JSON: {}", payloadJson, e)
            throw InvalidQrException("Unexpected error parsing QR payload JSON: ${e.message}")
        }

        // Nonce replay check
        val nonceKey = "$NONCE_PREFIX${qrPayload.n}"
        if (redisTemplate.opsForValue().get(nonceKey) != null) {
            logger.warn("Replay attack detected for nonce: {}", qrPayload.n)
            throw InvalidQrException("QR token has already been used")
        }

        // Store nonce with expiration matching token expiration
        val nonceExpirationSeconds = qrPayload.exp - Instant.now().epochSecond
        if (nonceExpirationSeconds > 0) {
            redisTemplate.opsForValue().set(nonceKey, "1", nonceExpirationSeconds, TimeUnit.SECONDS)
        }

        if (qrPayload.exp < Instant.now().epochSecond - qrSecurityProperties.clockSkewToleranceSeconds) {
            logger.warn("QR token has expired: {}", qrPayload.exp)
            throw InvalidQrException("QR token has expired")
        }
        logger.info("QR token validated and parsed successfully for nonce: {}", qrPayload.n)

        return qrPayload
    }

}