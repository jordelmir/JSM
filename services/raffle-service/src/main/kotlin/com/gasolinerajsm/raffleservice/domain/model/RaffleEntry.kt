package com.gasolinerajsm.raffleservice.domain.model

import jakarta.persistence.*
import java.util.UUID

/**
 * Represents an entry into a raffle.
 * This is a JPA entity mapped to the "raffle_entries" table.
 * @property id The unique identifier of the raffle entry. Auto-generated.
 * @property raffleId The ID of the raffle this entry belongs to.
 * @property pointId The unique identifier of the point (e.g., coupon ID) that generated this entry.
 * @property userId The ID of the user who owns this entry.
 */
@Entity
@Table(name = "raffle_entries")
data class RaffleEntry(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val raffleId: Long,
    val pointId: String,
    val userId: UUID // Add userId to RaffleEntry
)