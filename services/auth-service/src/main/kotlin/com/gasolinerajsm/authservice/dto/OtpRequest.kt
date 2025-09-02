package com.gasolinerajsm.authservice.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

/**
 * Data Transfer Object (DTO) for requesting an One-Time Password (OTP).
 * @property phone The phone number to which the OTP should be sent.
 *   Must not be blank and must follow a valid phone number format.
 */
data class OtpRequest(
    @field:NotBlank(message = "Phone number cannot be blank")
    @field:Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Invalid phone number format. Must be in E.164 format (e.g., +1234567890).")
    val phone: String
)