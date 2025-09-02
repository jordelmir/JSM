package com.gasolinerajsm.authservice.application.service

import com.gasolinerajsm.authservice.config.JwtProperties
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.security.Key
import java.util.Date
import java.util.concurrent.TimeUnit

@Service
class JwtService(
    private val redisTemplate: StringRedisTemplate,
    jwtProperties: JwtProperties
) {

    private val logger = LoggerFactory.getLogger(JwtService::class.java)

    private val accessSecret: String = jwtProperties.secret
    private val refreshSecret: String = jwtProperties.refreshSecret
    private val accessTokenExpirationMs: Long = jwtProperties.expirationMs
    private val refreshTokenExpirationMs: Long = jwtProperties.refreshExpirationMs

    private val accessTokenSigningKey: Key by lazy { getSigningKey(accessSecret) }
    private val refreshTokenSigningKey: Key by lazy { getSigningKey(refreshSecret) }

    companion object {
        private const val JWT_BLACKLIST_PREFIX = "jwt_blacklist:"
    }

    fun generateAccessToken(subject: String): String {
        return generateToken(subject, accessTokenExpirationMs, accessTokenSigningKey)
    }

    fun generateRefreshToken(subject: String): String {
        return generateToken(subject, refreshTokenExpirationMs, refreshTokenSigningKey)
    }

    private fun generateToken(subject: String, expirationMs: Long, signingKey: Key): String {
        return Jwts.builder()
            .setSubject(subject)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + expirationMs))
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun extractSubject(token: String): String {
        return extractClaim(token, Claims::getSubject, accessTokenSigningKey)
    }

    fun extractSubjectFromRefreshToken(token: String): String {
        return extractClaim(token, Claims::getSubject, refreshTokenSigningKey)
    }

    private fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T, signingKey: Key): T {
        val claims = extractAllClaims(token, signingKey)
        return claimsResolver(claims)
    }

    private fun extractAllClaims(token: String, signingKey: Key): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .body
    }

    fun isTokenValid(token: String): Boolean {
        return !isTokenExpired(token, accessTokenSigningKey) && !isTokenBlacklisted(token)
    }

    fun isRefreshTokenValid(token: String): Boolean {
        return !isTokenExpired(token, refreshTokenSigningKey) && !isTokenBlacklisted(token)
    }

    private fun isTokenExpired(token: String, signingKey: Key): Boolean {
        val expiration = extractClaim(token, Claims::getExpiration, signingKey)
        return expiration.before(Date())
    }

    private fun getSigningKey(secret: String): Key {
        val keyBytes = Decoders.BASE64.decode(secret)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    fun blacklistToken(token: String) {
        val expiration = try {
            extractClaim(token, Claims::getExpiration, accessTokenSigningKey)
        } catch (e: Exception) {
            try {
                extractClaim(token, Claims::getExpiration, refreshTokenSigningKey)
            } catch (e2: Exception) {
                logger.error("Could not extract expiration from token to blacklist it.", e2)
                return
            }
        }

        val now = Date()
        val remainingTimeMs = expiration.time - now.time

        if (remainingTimeMs > 0) {
            redisTemplate.opsForValue().set(JWT_BLACKLIST_PREFIX + token, "true", remainingTimeMs, TimeUnit.MILLISECONDS)
            logger.info("Token blacklisted for {} ms", remainingTimeMs)
        } else {
            logger.warn("Attempted to blacklist an already expired token.")
        }
    }

    fun isTokenBlacklisted(token: String): Boolean {
        return redisTemplate.hasKey(JWT_BLACKLIST_PREFIX + token)
    }
}
