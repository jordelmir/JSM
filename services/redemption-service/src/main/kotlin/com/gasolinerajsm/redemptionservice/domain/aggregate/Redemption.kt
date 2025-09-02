package com.gasolinerajsm.redemptionservice.domain.aggregate

import com.gasolinerajsm.redemptionservice.service.QrSecurityService.QrPayload
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant // New import
import java.util.UUID

@Entity
@Table(name = "redemptions") // Assuming a table named 'redemptions'
data class Redemption(
    @Id
    val id: UUID = UUID.randomUUID(),
    val userId: String,
    val stationId: String,
    val dispenserId: String,
    val nonce: String,
    val timestamp: Instant, // Changed to Instant
    val expiration: Instant // Changed to Instant
) {
    companion object {
        fun initiate(userId: String, qr: QrPayload, stationId: String, dispenserId: String): Redemption { // Added stationId and dispenserId
            return Redemption(
                userId = userId,
                stationId = stationId, // Use passed stationId
                dispenserId = dispenserId, // Use passed dispenserId
                nonce = qr.n,
                timestamp = Instant.ofEpochMilli(qr.t),
                expiration = Instant.ofEpochMilli(qr.exp)
            )
        }
    }
}
