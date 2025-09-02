package com.gasolinerajsm.redemptionservice.application

import com.gasolinerajsm.redemptionservice.domain.model.RedemptionStatus // New import
import java.util.UUID

data class RedemptionResult(
    val redemptionId: UUID,
    val status: RedemptionStatus, // Changed to RedemptionStatus enum
    val adUrl: String? = null, // Ad URL for the client to display
    val campaignId: Long? = null, // Campaign ID associated with the ad
    val creativeId: String? = null // Creative ID associated with the ad
)
