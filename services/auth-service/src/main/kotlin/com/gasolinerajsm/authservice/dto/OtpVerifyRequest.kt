package com.gasolinerajsm.authservice.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

/**
 * Data Transfer Object (DTO) for verifying an One-Time Password (OTP).
 * @property phone The phone number associated with the OTP.
 *   Must not be blank and must follow a valid phone number format.
 * @property code The 6-digit OTP code to be verified.
 *   Must not be blank and must be exactly 6 digits long.
 */
data class OtpVerifyRequest(
    @field:NotBlank(message = "Phone number cannot be blank")
    @field:Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Invalid phone number format. Must be in E.164 format (e.g., +1234567890).")
    val phone: String,

    @field:NotBlank(message = "OTP code cannot be blank")
    @field:Size(min = 6, max = 6, message = "OTP code must be 6 digits")
    val code: String
)