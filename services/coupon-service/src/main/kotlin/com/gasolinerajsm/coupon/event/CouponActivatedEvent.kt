package com.gasolinerajsm.coupon.event

import java.util.UUID

/**
 * Event published when a coupon is successfully activated.
 * This event carries essential information about the activated coupon and the user.
 * @property couponId The unique identifier of the activated coupon.
 * @property userId The unique identifier of the user who activated the coupon.
 * @property baseTickets The number of base tickets associated with the activated coupon.
 * @property stationId The unique identifier of the station where the coupon was activated.
 */
data class CouponActivatedEvent(
    val couponId: UUID,
    val userId: UUID, // Assuming userId is UUID from previous analysis
    val baseTickets: Int,
    val stationId: UUID // From QRCoupon entity
)
