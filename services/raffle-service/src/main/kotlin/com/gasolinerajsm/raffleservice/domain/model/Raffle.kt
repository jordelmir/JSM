package com.gasolinerajsm.raffleservice.domain.model

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Represents a Raffle entity in the raffle service.
 * This is a JPA entity mapped to the "raffles" table.
 * @property id The unique identifier of the raffle. Auto-generated.
 * @property period The period for which the raffle is valid (e.g., "2025-08").
 * @property merkleRoot The Merkle root of all entries for this raffle, ensuring integrity.
 * @property status The current status of the raffle (OPEN, CLOSED, DRAWN).
 * @property createdAt The timestamp when the raffle record was created.
 * @property drawAt The scheduled or actual timestamp when the raffle was drawn.
 * @property externalSeed An optional external seed used for the raffle draw, ensuring transparency.
 * @property winnerEntryId The ID of the winning entry for this raffle, if drawn.
 */
@Entity
@Table(name = "raffles")
data class Raffle(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    val period: String,
    val merkleRoot: String,
    @Enumerated(EnumType.STRING)
    var status: RaffleStatus = RaffleStatus.OPEN,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var drawAt: LocalDateTime? = null,
    var externalSeed: String? = null,
    var winnerEntryId: String? = null // ID del punto ganador
)

/**
 * Represents the possible statuses of a raffle.
 */
enum class RaffleStatus {
    OPEN,       // Raffle is open for entries
    CLOSED,     // Raffle is closed for entries, but not yet drawn
    DRAWN       // Raffle has been drawn and a winner is determined
}