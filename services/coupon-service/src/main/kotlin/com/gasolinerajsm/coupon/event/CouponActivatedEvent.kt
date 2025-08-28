package com.gasolinerajsm.coupon.event

import java.util.UUID

data class CouponActivatedEvent(
    val couponId: UUID,
    val userId: UUID, // Assuming userId is UUID from previous analysis
    val baseTickets: Int,
    val stationId: UUID // From QRCoupon entity
)