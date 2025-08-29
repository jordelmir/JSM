package com.gasolinerajsm.raffleservice.domain.model

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "raffle_entries")
data class RaffleEntry(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val raffleId: Long,
    val pointId: String,
    val userId: UUID // Add userId to RaffleEntry
)
