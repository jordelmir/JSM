package com.gasolinerajsm.coupon.adapter.in.web

import com.gasolinerajsm.coupon.dto.*
import com.gasolinerajsm.coupon.service.QRCouponService
import com.gasolinerajsm.coupon.service.QRCodeGenerator
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import com.gasolinerajsm.common.api.ApiResponse // Import ApiResponse
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/coupons")
class CouponController(
    private val couponService: QRCouponService,
    private val qrCodeGenerator: QRCodeGenerator
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('OWNER')")
    fun generateCoupon(@Valid @RequestBody request: GenerateQRRequest): ResponseEntity<ApiResponse<GenerateQRResponse>> {
        val coupon = couponService.generateQRCoupon(request)
        val response = GenerateQRResponse(
            couponId = coupon.id,
            qrCode = coupon.qrCode,
            token = coupon.token,
            baseTickets = coupon.baseTickets,
            expiresAt = coupon.expiresAt
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse(data = response))
    }

    @PostMapping("/scan")
    @PreAuthorize("hasRole('CLIENT')")
    fun scanCoupon(@RequestBody request: ScanQRRequest): ResponseEntity<ApiResponse<ScanQRResponse>> {
        val coupon = couponService.scanQRCoupon(request)
        val response = ScanQRResponse(
            couponId = coupon.id,
            token = coupon.token,
            baseTickets = coupon.baseTickets,
            canActivate = true,
            message = "¡QR escaneado exitosamente! Toca 'Activar' para comenzar."
        )
        return ResponseEntity.ok(ApiResponse(data = response))
    }

    @PostMapping("/{id}/activation")
    @PreAuthorize("hasRole('CLIENT')")
    fun activateCoupon(@PathVariable id: UUID, @RequestBody request: ActivateCouponRequest): ResponseEntity<ApiResponse<ActivateCouponResponse>> {
        val coupon = couponService.activateCoupon(id, request.userId) // Assuming service method is updated
        val response = ActivateCouponResponse(
            couponId = coupon.id,
            token = coupon.token,
            baseTickets = coupon.baseTickets,
            nextAdDuration = 10, // First ad duration
            message = "¡Cupón activado! Mira el anuncio para duplicar tus tickets."
        )
        return ResponseEntity.ok(ApiResponse(data = response))
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'OWNER')")
    fun getCouponById(@PathVariable id: UUID): ResponseEntity<ApiResponse<CouponDetailsResponse>> {
        val coupon = couponService.getCouponDetails(id)
        val response = CouponDetailsResponse(
            id = coupon.id,
            token = coupon.token,
            amount = coupon.amount,
            baseTickets = coupon.baseTickets,
            bonusTickets = coupon.bonusTickets,
            totalTickets = coupon.totalTickets,
            status = coupon.status,
            scannedAt = coupon.scannedAt,
            activatedAt = coupon.activatedAt,
            expiresAt = coupon.expiresAt,
            createdAt = coupon.createdAt
        )
        return ResponseEntity.ok(ApiResponse(data = response))
    }

    // The stats endpoints remain as they are, but could be moved to a separate controller e.g., CouponStatsController

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('CLIENT') and #userId == authentication.principal.id")
    fun getUserCoupons(@PathVariable userId: UUID, pageable: Pageable): ResponseEntity<Page<CouponDetailsResponse>> {
        val couponsPage = couponService.getUserCoupons(userId, pageable)
        val couponDetailsPage = couponsPage.map { coupon ->
            CouponDetailsResponse(
                id = coupon.id,
                token = coupon.token,
                amount = coupon.amount,
                baseTickets = coupon.baseTickets,
                bonusTickets = coupon.bonusTickets,
                totalTickets = coupon.totalTickets,
                status = coupon.status,
                scannedAt = coupon.scannedAt,
                activatedAt = coupon.activatedAt,
                expiresAt = coupon.expiresAt,
                createdAt = coupon.createdAt
            )
        }
        return ResponseEntity.ok(couponDetailsPage)
    }

    @GetMapping("/station/{stationId}/stats")
    @PreAuthorize("hasRole('OWNER')")
    fun getStationStats(
        @PathVariable stationId: UUID,
        @RequestParam(defaultValue = "30") days: Int
    ): ResponseEntity<StationStatsResponse> {
        val stats = couponService.getStationStats(stationId, days)

        val response = StationStatsResponse(
            stationId = stationId,
            totalCoupons = stats["totalCoupons"] as Int,
            totalTickets = stats["totalTickets"] as Int,
            activeCoupons = stats["activeCoupons"] as Int,
            expiredCoupons = stats["expiredCoupons"] as Int,
            conversionRate = if (stats["totalCoupons"] as Int > 0) {
                (stats["activeCoupons"] as Int).toDouble() / (stats["totalCoupons"] as Int) * 100
            } else 0.0,
            period = "${days} días"
        )

        return ResponseEntity.ok(response)
    }

    @GetMapping("/employee/{employeeId}/stats")
    @PreAuthorize("hasRole('EMPLOYEE') and #employeeId == authentication.principal.id or hasRole('OWNER')")
    fun getEmployeeStats(
        @PathVariable employeeId: UUID,
        @RequestParam(defaultValue = "30") days: Int
    ): ResponseEntity<EmployeeStatsResponse> {
        val stats = couponService.getEmployeeStats(employeeId, days)

        val response = EmployeeStatsResponse(
            employeeId = employeeId,
            totalCoupons = stats["totalCoupons"] as Int,
            totalTickets = stats["totalTickets"] as Int,
            scannedCoupons = stats["scannedCoupons"] as Int,
            conversionRate = stats["conversionRate"] as Double,
            period = "${days} días"
        )

        return ResponseEntity.ok(response)
    }
}