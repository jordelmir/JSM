package com.gasolinerajsm.raffleservice.adapter.in.web.dto

/**
 * DTO for providing all necessary data to publicly verify the fairness of a raffle draw.
 */
data class RaffleVerificationDetailsDto(
    val raffleId: String,
    val serverSeedHash: String,
    val clientSeed: String?,
    val publicSeed: String, // e.g., Bitcoin block hash
    val finalCombinedSeed: String,
    val winnerId: String,
    val merkleRoot: String,
    val entries: List<String>
)
