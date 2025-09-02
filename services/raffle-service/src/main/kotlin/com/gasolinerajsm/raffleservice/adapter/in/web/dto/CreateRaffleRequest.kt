package com.gasolinerajsm.raffleservice.adapter.in.web.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

/**
 * Data Transfer Object (DTO) for creating a new raffle.
 * @property period The period for which the raffle is being created (e.g., "WEEKLY", "MONTHLY").
 *   Must not be blank.
 * @property pointEntries A list of point entry IDs participating in this raffle.
 *   Must not be null.
 */
data class CreateRaffleRequest(
    @field:NotBlank(message = "Period cannot be blank")
    val period: String,
    @field:NotNull(message = "Point entries cannot be null")
    val pointEntries: List<String>
)