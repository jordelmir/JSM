package com.gasolinerajsm.raffleservice.adapter.in.web.dto

import jakarta.validation.constraints.Min

/**
 * Data Transfer Object (DTO) for requesting to draw a raffle.
 * @property blockHeight The blockchain block height to be used as a source of randomness for the draw.
 *   Must be a non-negative value.
 */
data class DrawRaffleRequest(
    @field:Min(value = 0, message = "Block height must be a non-negative value")
    val blockHeight: Long
)