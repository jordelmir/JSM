package com.gasolinerajsm.coupon.service

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

@Service
@Transactional
class QRCouponService(
    private val couponRepository: QRCouponRepository,
    private val qrCodeGenerator: QRCodeGenerator,
    private val tokenGenerator: TokenGenerator,
    private val rabbitTemplate: RabbitTemplate,
    private val redisTemplate: RedisTemplate<String, Any>,
    private val couponProperties: CouponProperties,
    private val outboxRepository: OutboxRepository, // Inject OutboxRepository
    private val objectMapper: ObjectMapper // Inject ObjectMapper
) {

    fun generateQRCoupon(request: GenerateQRRequest): QRCoupon {
        val token = tokenGenerator.generateUniqueToken()
        val qrCode = qrCodeGenerator.generateQRCode(token) // Keep QR code string generation
        val baseTickets = request.amount // 1 ticket por cada múltiplo de 5000

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
            24,
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

    fun scanQRCoupon(request: ScanQRRequest): QRCoupon {
        val coupon = couponRepository.findAndLockByQrCode(request.qrCode)
            ?: throw IllegalArgumentException("QR Code no válido")

        if (coupon.status != CouponStatus.GENERATED) {
            throw IllegalStateException("Este QR ya fue utilizado")
        }

        if (coupon.expiresAt.isBefore(LocalDateTime.now())) {
            throw IllegalStateException("Este QR ha expirado")
        }

        val updatedCoupon = coupon.copy(
            status = CouponStatus.SCANNED,
            scannedBy = request.userId,
            scannedAt = LocalDateTime.now()
        )

        return couponRepository.save(updatedCoupon)
    }

    fun activateCoupon(request: ActivateCouponRequest): QRCoupon {
        val coupon = couponRepository.findById(request.couponId)
            .orElseThrow { IllegalArgumentException("Cupón no encontrado") }

        if (coupon.scannedBy != request.userId) {
            throw IllegalArgumentException("No tienes permisos para activar este cupón")
        }

        if (coupon.status != CouponStatus.SCANNED) {
            throw IllegalStateException("Este cupón no puede ser activado")
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

    fun getUserCoupons(userId: UUID, pageable: Pageable): Page<QRCoupon> {
        return couponRepository.findByScannedBy(userId, pageable)
    }

    fun getUserActiveTickets(userId: UUID): Int {
        val activeCoupons = couponRepository.findByUserIdAndStatuses(
            userId,
            listOf(CouponStatus.ACTIVATED, CouponStatus.COMPLETED)
        )
        return activeCoupons.sumOf { it.totalTickets }
    }

    fun getStationStats(stationId: UUID, days: Int = 30): Map<String, Any> {
        return couponRepository.getStationStats(stationId)
    }

    fun getEmployeeStats(employeeId: UUID, days: Int = 30): Map<String, Any> {
        return couponRepository.getEmployeeStats(employeeId)
    }
}