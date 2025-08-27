package com.gasolinerajsm.raffleservice.dto

import java.util.UUID

data class PointIdResponse(
    val pointId: String,
    val userId: UUID // Assuming redemption service can provide user ID with point ID
)

data class PointIdsByPeriodResponse(
    val pointIds: List<PointIdResponse>
)
