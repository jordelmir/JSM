package com.gasolinerajsm.raffleservice.domain.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID // Import UUID

/**
 * Represents a Raffle Winner entity.
 * This is a JPA entity mapped to the "raffle_winners" table.
 * @property id The unique identifier of the raffle winner. Auto-generated.
 * @property raffleId The ID of the raffle this winner belongs to.
 * @property userId The ID of the user who won the raffle.
 * @property winningPointId The ID of the winning point (e.g., coupon ID) that secured the win.
 * @property prize The description of the prize won (e.g., "10000 Puntos G").
 * @property awardedAt The timestamp when the prize was awarded.
 */
@Entity
@Table(name = "raffle_winners")
data class RaffleWinner(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    val raffleId: Long,
    val userId: UUID, // Changed to UUID
    val winningPointId: UUID, // Changed to UUID
    val prize: String, // e.g., "10000 Puntos G"
    val awardedAt: LocalDateTime = LocalDateTime.now()
)