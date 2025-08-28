package com.gasolinerajsm.redemptionservice.application

import jakarta.validation.constraints.NotBlank

import jakarta.validation.constraints.NotNull // Import NotNull

data class RedeemCommand(
    @field:NotNull(message = "User ID cannot be null") // Change to NotNull for Long
    val userId: Long, // Change type to Long

    @field:NotBlank(message = "QR token cannot be blank")
    val qrToken: String
)