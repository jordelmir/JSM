package com.gasolinerajsm.coupon.adapter.in.web

import com.gasolinerajsm.coupon.dto.*
import com.gasolinerajsm.coupon.config.CouponProperties // New import
import com.gasolinerajsm.coupon.service.QRCouponService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import com.gasolinerajsm.common.api.ApiResponse
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

/**
 * REST Controller for managing coupon-related operations.
 * Provides endpoints for generating, scanning, activating, retrieving, and getting stats for coupons.
 */
@RestController
@RequestMapping("/coupons")
class CouponController(
    private val couponService: QRCouponService,
    private val couponProperties: CouponProperties // Inject CouponProperties
) {

    /**
     * Generates a new QR coupon.
     * Requires EMPLOYEE or OWNER role.
     * @param request The request body containing details for generating the QR coupon.
     * @return ResponseEntity with ApiResponse containing the generated coupon details.
     */
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

    /**
     * Scans a QR coupon.
     * Requires CLIENT role.
     * @param request The request body containing details for scanning the QR coupon.
     * @return ResponseEntity with ApiResponse containing the scanned coupon details and a message.
     */
    @PostMapping("/scan")
    @PreAuthorize("hasRole('CLIENT')")
    fun scanCoupon(@RequestBody request: ScanQRRequest): ResponseEntity<ApiResponse<ScanQRResponse>> {
        val coupon = couponService.scanQRCoupon(request)
        val response = ScanQRResponse(
            couponId = coupon.id,
            token = coupon.token,
            baseTickets = coupon.baseTickets,
            canActivate = true,
            message = "QR scanned successfully! Tap 'Activate' to start." // Translated
        )
        return ResponseEntity.ok(ApiResponse(data = response))
    }

    /**
     * Activates a coupon.
     * Requires CLIENT role.
     * @param id The ID of the coupon to activate.
     * @param request The request body containing details for activating the coupon (e.g., userId).
     * @return ResponseEntity with ApiResponse containing the activated coupon details and a message.
     */
    @PostMapping("/{id}/activation")
    @PreAuthorize("hasRole('CLIENT')")
    fun activateCoupon(@PathVariable id: UUID, @RequestBody request: ActivateCouponRequest): ResponseEntity<ApiResponse<ActivateCouponResponse>> {
        val coupon = couponService.activateCoupon(id, request.userId) // Assuming service method is updated
        val response = ActivateCouponResponse(
            couponId = coupon.id,
            token = coupon.token,
            baseTickets = coupon.baseTickets,
            nextAdDuration = couponProperties.nextAdDuration, // Use configurable property
            message = "Coupon activated! Watch the ad to double your tickets." // Translated
        )
        return ResponseEntity.ok(ApiResponse(data = response))
    }

    /**
     * Retrieves coupon details by ID.
     * Requires CLIENT or OWNER role.
     * @param id The ID of the coupon to retrieve.
     * @return ResponseEntity with ApiResponse containing the coupon details.
     */
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

    /**
     * Retrieves a paginated list of coupons for a specific user.
     * Requires CLIENT role and the userId must match the authenticated principal's ID.
     * @param userId The ID of the user whose coupons to retrieve.
     * @param pageable Pagination information.
     * @return ResponseEntity with a Page of CouponDetailsResponse.
     */
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

    /**
     * Retrieves statistics for a specific station.
     * Requires OWNER role.
     * @param stationId The ID of the station to retrieve stats for.
     * @param days The number of days for which to retrieve statistics (default: 30).
     * @return ResponseEntity with StationStatsResponse.
     */
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
            period = "${days} days" // Translated
        )

        return ResponseEntity.ok(response)
    }

    /**
     * Retrieves statistics for a specific employee.
     * Requires EMPLOYEE role (and employeeId must match principal's ID) or OWNER role.
     * @param employeeId The ID of the employee to retrieve stats for.
     * @param days The number of days for which to retrieve statistics (default: 30).
     * @return ResponseEntity with EmployeeStatsResponse.
     */
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
            period = "${days} days" // Translated
        )

        return ResponseEntity.ok(response)
    }
}
