package com.gasolinerajsm.redemptionservice.domain.repository

import com.gasolinerajsm.redemptionservice.domain.aggregate.Redemption
import java.util.UUID // New import

interface RedemptionRepository {
    fun save(redemption: Redemption): Redemption
    fun findById(id: UUID): Redemption? // Changed to UUID
}
