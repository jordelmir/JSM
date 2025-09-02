package com.gasolinerajsm.coupon.dto

import com.gasolinerajsm.coupon.domain.CouponStatus
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime
import java.util.*

/**
 * Data Transfer Object (DTO) for generating a new QR coupon.
 * @property stationId The unique identifier of the station where the coupon is generated.
 *   Must not be null.
 * @property employeeId The unique identifier of the employee generating the coupon.
 *   Must not be null.
 * @property amount The monetary amount associated with the coupon.
 *   Must be a minimum of 5000.
 */
data class GenerateQRRequest(
    @field:NotNull(message = "El ID de la estación no puede ser nulo") // TODO: Externalize validation messages for i18n
    val stationId: UUID,

    @field:NotNull(message = "El ID del empleado no puede ser nulo") // TODO: Externalize validation messages for i18n
    val employeeId: UUID,

    @field:Min(value = 5000, message = "El monto mínimo es de 5000") // TODO: Externalize validation messages for i18n
    val amount: Int // Múltiplos de 5000
)

/**
 * Data Transfer Object (DTO) representing the response after generating a QR coupon.
 * @property couponId The unique identifier of the generated coupon.
 * @property qrCode The string representation of the QR code.
 * @property token The unique token associated with the coupon.
 * @property baseTickets The number of base tickets earned with this coupon.
 * @property expiresAt The timestamp when the coupon expires.
 */
data class GenerateQRResponse(
    val couponId: UUID,
    val qrCode: String,
    val token: String,
    val baseTickets: Int,
    val expiresAt: LocalDateTime
)

/**
 * Data Transfer Object (DTO) for scanning a QR coupon.
 * @property qrCode The QR code string that was scanned.
 * @property userId The unique identifier of the user who scanned the QR code.
 */
data class ScanQRRequest(
    val qrCode: String,
    val userId: UUID
)

/**
 * Data Transfer Object (DTO) representing the response after scanning a QR coupon.
 * @property couponId The unique identifier of the scanned coupon.
 * @property token The unique token associated with the coupon.
 * @property baseTickets The number of base tickets associated with the coupon.
 * @property canActivate A boolean indicating if the coupon can be activated.
 * @property message A message providing feedback about the scan operation.
 */
data class ScanQRResponse(
    val couponId: UUID,
    val token: String,
    val baseTickets: Int,
    val canActivate: Boolean,
    val message: String
)

/**
 * Data Transfer Object (DTO) for activating a coupon.
 * @property couponId The unique identifier of the coupon to activate.
 * @property userId The unique identifier of the user activating the coupon.
 */
data class ActivateCouponRequest(
    val couponId: UUID,
    val userId: UUID
)

/**
 * Data Transfer Object (DTO) representing the response after activating a coupon.
 * @property couponId The unique identifier of the activated coupon.
 * @property token The unique token associated with the coupon.
 * @property baseTickets The number of base tickets associated with the coupon.
 * @property nextAdDuration The duration of the next ad to be displayed in seconds.
 * @property message A message providing feedback about the activation operation.
 */
data class ActivateCouponResponse(
    val couponId: UUID,
    val token: String,
    val baseTickets: Int,
    val nextAdDuration: Int, // Duración del primer anuncio en segundos
    val message: String
)

/**
 * Data Transfer Object (DTO) representing detailed information about a coupon.
 * @property id The unique identifier of the coupon.
 * @property token The unique token associated with the coupon.
 * @property amount The monetary amount associated with the coupon.
 * @property baseTickets The number of base tickets earned with this coupon.
 * @property bonusTickets The number of bonus tickets earned with this coupon.
 * @property totalTickets The total number of tickets (base + bonus) for this coupon.
 * @property status The current status of the coupon (e.g., GENERATED, SCANNED, ACTIVATED).
 * @property scannedAt The timestamp when the coupon was scanned, if applicable.
 * @property activatedAt The timestamp when the coupon was activated, if applicable.
 * @property expiresAt The timestamp when the coupon expires.
 * @property createdAt The timestamp when the coupon was created.
 */
data class CouponDetailsResponse(
    val id: UUID,
    val token: String,
    val amount: Int,
    val baseTickets: Int,
    val bonusTickets: Int,
    val totalTickets: Int,
    val status: CouponStatus,
    val scannedAt: LocalDateTime?,
    val activatedAt: LocalDateTime?,
    val expiresAt: LocalDateTime,
    val createdAt: LocalDateTime
)

/**
 * Data Transfer Object (DTO) representing a user's active tickets and eligible raffles.
 * @property totalActiveTickets The total number of active tickets the user has.
 * @property coupons A list of detailed coupon responses for the user.
 * @property weeklyRaffleEligible A boolean indicating if the user is eligible for the weekly raffle.
 * @property annualRaffleEligible A boolean indicating if the user is eligible for the annual raffle.
 */
data class UserTicketsResponse(
    val totalActiveTickets: Int,
    val coupons: List<CouponDetailsResponse>,
    val weeklyRaffleEligible: Boolean,
    val annualRaffleEligible: Boolean
)

/**
 * Data Transfer Object (DTO) representing statistics for a specific station.
 * @property stationId The unique identifier of the station.
 * @property totalCoupons The total number of coupons generated for this station.
 * @property totalTickets The total number of tickets generated for this station.
 * @property activeCoupons The number of active coupons for this station.
 * @property expiredCoupons The number of expired coupons for this station.
 * @property conversionRate The conversion rate of coupons for this station.
 * @property period The period for which the statistics are calculated (e.g., "30 días").
 */
data class StationStatsResponse(
    val stationId: UUID,
    val totalCoupons: Int,
    val totalTickets: Int,
    val activeCoupons: Int,
    val expiredCoupons: Int,
    val conversionRate: Double,
    val period: String
)

/**
 * Data Transfer Object (DTO) representing statistics for a specific employee.
 * @property employeeId The unique identifier of the employee.
 * @property totalCoupons The total number of coupons generated by this employee.
 * @property totalTickets The total number of tickets generated by this employee.
 * @property scannedCoupons The number of coupons scanned by this employee.
 * @property conversionRate The conversion rate of coupons scanned by this employee.
 * @property period The period for which the statistics are calculated (e.g., "30 días").
 */
data class EmployeeStatsResponse(
    val employeeId: UUID,
    val totalCoupons: Int,
    val totalTickets: Int,
    val scannedCoupons: Int,
    val conversionRate: Double,
    val period: String
)
