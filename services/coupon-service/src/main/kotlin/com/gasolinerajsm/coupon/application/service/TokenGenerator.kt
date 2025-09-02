package com.gasolinerajsm.coupon.application.service

import com.gasolinerajsm.coupon.config.QrSecurityProperties
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.security.Key
import java.util.Date

/**
 * Generates and validates signed JWTs for QR Codes to ensure their authenticity and integrity.
 */
@Service
class TokenGenerator(private val securityProperties: QrSecurityProperties) {

    private val signingKey: Key by lazy {
        val keyBytes = Decoders.BASE64.decode(securityProperties.secret)
        Keys.hmacShaKeyFor(keyBytes)
    }

    /**
     * Creates a signed JWS token containing coupon information.
     *
     * @param couponId The unique identifier of the coupon.
     * @return A signed JWT string.
     */
    fun generateSignedCouponToken(couponId: String): String {
        val now = System.currentTimeMillis()
        // Expiration is handled by the JWT itself, so no need for separate expiration logic here.
        val expirationTime = now + securityProperties.expirationMinutes * 60 * 1000

        return Jwts.builder()
            .claim("couponId", couponId)
            .setIssuedAt(Date(now))
            .setExpiration(Date(expirationTime))
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact()
    }
}
