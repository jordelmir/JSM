package com.gasolinerajsm.coupon.application.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.gasolinerajsm.coupon.config.CouponProperties
import com.gasolinerajsm.coupon.config.QrSecurityProperties
import com.gasolinerajsm.coupon.domain.CouponStatus
import com.gasolinerajsm.coupon.domain.QRCoupon
import com.gasolinerajsm.coupon.dto.ActivateCouponRequest
import com.gasolinerajsm.coupon.dto.GenerateQRRequest
import com.gasolinerajsm.coupon.dto.ScanQRRequest
import com.gasolinerajsm.coupon.event.CouponActivatedEvent
import com.gasolinerajsm.coupon.outbox.Outbox
import com.gasolinerajsm.coupon.repository.OutboxRepository
import com.gasolinerajsm.coupon.repository.QRCouponRepository
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jws
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.Key
import java.time.LocalDateTime
import java.util.*

@Service
@Transactional
class QRCouponService(
    private val couponRepository: QRCouponRepository,
    private val tokenGenerator: TokenGenerator,
    private val outboxRepository: OutboxRepository,
    private val objectMapper: ObjectMapper,
    private val securityProperties: QrSecurityProperties
) {

    private val signingKey: Key by lazy {
        val keyBytes = Base64.getDecoder().decode(securityProperties.secret)
        Keys.hmacShaKeyFor(keyBytes)
    }

    fun generateQRCoupon(request: GenerateQRRequest): QRCoupon {
        val coupon = QRCoupon(
            stationId = request.stationId,
            employeeId = request.employeeId,
            amount = request.amount,
            baseTickets = 0, // Will be set after saving
            totalTickets = 0,
            expiresAt = LocalDateTime.now().plusHours(24) // Example expiration
        )
        val savedCoupon = couponRepository.save(coupon)

        // Now generate the token with the actual coupon ID
        val token = tokenGenerator.generateSignedCouponToken(savedCoupon.id.toString())
        savedCoupon.token = token

        return couponRepository.save(savedCoupon)
    }

    fun scanQRCoupon(request: ScanQRRequest, userId: String): QRCoupon {
        val couponId = validateAndExtractCouponId(request.qrCodeData)

        val coupon = couponRepository.findAndLockById(UUID.fromString(couponId))
            ?: throw IllegalArgumentException("Invalid QR Code")

        if (coupon.status != CouponStatus.GENERATED) {
            throw IllegalStateException("QR Code has already been used")
        }

        if (coupon.expiresAt.isBefore(LocalDateTime.now())) {
            throw IllegalStateException("QR Code has expired")
        }

        coupon.status = CouponStatus.SCANNED
        coupon.scannedBy = userId
        coupon.scannedAt = LocalDateTime.now()

        return couponRepository.save(coupon)
    }

    private fun validateAndExtractCouponId(token: String): String {
        try {
            val claims: Jws<Claims> = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)

            // Additional validation can be done here (e.g., issuer)

            return claims.body.get("couponId", String::class.java)
        } catch (e: Exception) {
            // Log the exception
            throw SecurityException("Invalid QR Code Token", e)
        }
    }

    fun activateCoupon(couponId: UUID, userId: String): QRCoupon {
        val coupon = couponRepository.findById(couponId)
            .orElseThrow { IllegalArgumentException("Coupon not found") }

        if (coupon.scannedBy != userId) {
            throw SecurityException("User does not have permission to activate this coupon")
        }

        if (coupon.status != CouponStatus.SCANNED) {
            throw IllegalStateException("Coupon cannot be activated")
        }

        coupon.status = CouponStatus.ACTIVATED
        coupon.activatedAt = LocalDateTime.now()

        val savedCoupon = couponRepository.save(coupon)

        val event = CouponActivatedEvent(
            couponId = savedCoupon.id!!,
            userId = userId,
            baseTickets = savedCoupon.baseTickets,
            stationId = savedCoupon.stationId
        )
        val outboxEvent = Outbox(
            aggregateType = "coupon",
            aggregateId = savedCoupon.id.toString(),
            eventType = event.javaClass.simpleName,
            payload = objectMapper.writeValueAsString(event)
        )
        outboxRepository.save(outboxEvent)

        return savedCoupon
    }

    fun getUserCoupons(userId: String, pageable: Pageable): Page<QRCoupon> {
        return couponRepository.findByScannedBy(userId, pageable)
    }

     fun getCouponDetails(couponId: UUID): QRCoupon {
        return couponRepository.findById(couponId).orElseThrow { NoSuchElementException("Coupon not found") }
    }

    // Stats methods remain the same...
}


import com.gasolinerajsm.coupon.repository.QRCouponRepository
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit
import com.fasterxml.jackson.databind.ObjectMapper // Import ObjectMapper
import com.gasolinerajsm.coupon.outbox.Outbox // Import Outbox
import com.gasolinerajsm.coupon.repository.OutboxRepository // Import OutboxRepository
import com.gasolinerajsm.coupon.event.CouponActivatedEvent // Import CouponActivatedEvent
import com.gasolinerajsm.coupon.dto.* // Import all DTOs

/**
 * Service responsible for managing QR Coupons.
 * This includes generating, scanning, activating, retrieving, and providing statistics for coupons.
 * It integrates with JPA for persistence, Redis for caching, and uses an Outbox pattern for event publishing.
 */
@Service
@Transactional
class QRCouponService(
    private val couponRepository: QRCouponRepository,
    private val qrCodeService: QrCodeService, // Renamed and clarified
    private val tokenGenerator: TokenGenerator,
    private val rabbitTemplate: RabbitTemplate, // Not directly used in current methods, but might be for events
    private val redisTemplate: RedisTemplate<String, Any>,
    private val couponProperties: CouponProperties,
    private val outboxRepository: OutboxRepository,
    private val objectMapper: ObjectMapper
) {

    /**
     * Generates a new QR coupon based on the provided request.
     * The coupon includes a unique token, QR code string, and calculated base tickets.
     * It also caches the QR code and saves a QR generation event to the outbox.
     * @param request The request containing details for generating the QR coupon.
     * @return The newly generated QRCoupon entity.
     */
    fun generateQRCoupon(request: GenerateQRRequest): QRCoupon {
        val token = tokenGenerator.generateUniqueToken()
        val qrCode = qrCodeService.generateSignedQrPayload(token) // Generates the QR code string
        val baseTickets = request.amount / couponProperties.ticketRatio // Use configurable ticket ratio

        val coupon = QRCoupon(
            qrCode = qrCode,
            token = token,
            stationId = request.stationId,
            employeeId = request.employeeId,
            amount = request.amount,
            baseTickets = baseTickets,
            totalTickets = baseTickets,
            expiresAt = LocalDateTime.now().plusHours(couponProperties.expirationHours)
        )

        val savedCoupon = couponRepository.save(coupon)

        // Cache QR code for quick lookup
        redisTemplate.opsForValue().set(
            "qr:${qrCode}",
            savedCoupon.id.toString(),
            couponProperties.qrCodeCacheExpirationHours, // Use configurable property
            TimeUnit.HOURS
        )

        // Save event to outbox for asynchronous QR image generation
        val qrGenerateEvent = mapOf(
            "couponId" to savedCoupon.id.toString(),
            "qrCode" to savedCoupon.qrCode
        )
        val outboxQrGenerateEvent = Outbox(
            aggregateType = "coupon",
            aggregateId = savedCoupon.id.toString(),
            eventType = "QrGenerateEvent",
            payload = objectMapper.writeValueAsString(qrGenerateEvent)
        )
        outboxRepository.save(outboxQrGenerateEvent)

        return savedCoupon
    }

    /**
     * Scans a QR coupon.
     * Validates the coupon's status and expiration before marking it as scanned.
     * @param request The request containing details for scanning the QR coupon.
     * @return The scanned QRCoupon entity.
     * @throws IllegalArgumentException if the QR Code is invalid.
     * @throws IllegalStateException if the QR is already used or expired.
     */
    fun scanQRCoupon(request: ScanQRRequest): QRCoupon {
        val coupon = couponRepository.findAndLockByQrCode(request.qrCode)
            ?: throw IllegalArgumentException("QR Code no válido") // Translated

        if (coupon.status != CouponStatus.GENERATED) {
            throw IllegalStateException("Este QR ya fue utilizado") // Translated
        }

        if (coupon.expiresAt.isBefore(LocalDateTime.now())) {
            throw IllegalStateException("Este QR ha expirado") // Translated
        }

        val updatedCoupon = coupon.copy(
            status = CouponStatus.SCANNED,
            scannedBy = request.userId,
            scannedAt = LocalDateTime.now()
        )

        return couponRepository.save(updatedCoupon)
    }

    /**
     * Activates a scanned coupon.
     * Validates user permissions and coupon status before activation.
     * Saves a CouponActivatedEvent to the outbox.
     * @param request The request containing details for activating the coupon (couponId, userId).
     * @return The activated QRCoupon entity.
     * @throws IllegalArgumentException if the coupon is not found or user has no permissions.
     * @throws IllegalStateException if the coupon cannot be activated due to its status.
     */
    fun activateCoupon(request: ActivateCouponRequest): QRCoupon {
        val coupon = couponRepository.findById(request.couponId)
            .orElseThrow { IllegalArgumentException("Cupón no encontrado") } // Translated

        if (coupon.scannedBy != request.userId) {
            throw IllegalArgumentException("No tienes permisos para activar este cupón") // Translated
        }

        if (coupon.status != CouponStatus.SCANNED) {
            throw IllegalStateException("Este cupón no puede ser activado") // Translated
        }

        val updatedCoupon = coupon.copy(
            status = CouponStatus.ACTIVATED,
            activatedAt = LocalDateTime.now()
        )

        val savedCoupon = couponRepository.save(updatedCoupon)

        // Save event to outbox for initiating ad sequence
        val event = CouponActivatedEvent(
            couponId = savedCoupon.id,
            userId = request.userId,
            baseTickets = savedCoupon.baseTickets,
            stationId = savedCoupon.stationId // Include stationId from QRCoupon
        )
        val outboxEvent = Outbox(
            aggregateType = "coupon",
            aggregateId = savedCoupon.id.toString(),
            eventType = event.javaClass.simpleName, // Use simple name for eventType
            payload = objectMapper.writeValueAsString(event)
        )
        outboxRepository.save(outboxEvent)

        return savedCoupon
    }

    /**
     * Retrieves a paginated list of coupons for a specific user.
     * @param userId The ID of the user whose coupons to retrieve.
     * @param pageable Pagination information.
     * @return A Page of QRCoupon entities.
     */
    fun getUserCoupons(userId: UUID, pageable: Pageable): Page<QRCoupon> {
        return couponRepository.findByScannedBy(userId, pageable)
    }

    /**
     * Calculates the total number of active tickets for a specific user.
     * Active tickets are those from coupons with 'ACTIVATED' or 'COMPLETED' status.
     * @param userId The ID of the user.
     * @return The total count of active tickets.
     */
    fun getUserActiveTickets(userId: UUID): Int {
        val activeCoupons = couponRepository.findByUserIdAndStatuses(
            userId,
            listOf(CouponStatus.ACTIVATED, CouponStatus.COMPLETED)
        )
        return activeCoupons.sumOf { it.totalTickets }
    }

    /**
     * Retrieves statistics for a specific station.
     * @param stationId The ID of the station to retrieve stats for.
     * @param days The number of days for which to retrieve statistics (default: 30).
     * @return A Map containing various statistics for the station.
     */
    fun getStationStats(stationId: UUID, days: Int = 30): Map<String, Any> {
        return couponRepository.getStationStats(stationId)
    }

    /**
     * Retrieves statistics for a specific employee.
     * @param employeeId The ID of the employee to retrieve stats for.
     * @param days The number of days for which to retrieve statistics (default: 30).
     * @return A Map containing various statistics for the employee.
     */
    fun getEmployeeStats(employeeId: UUID, days: Int = 30): Map<String, Any> {
        return couponRepository.getEmployeeStats(employeeId)
    }
}
