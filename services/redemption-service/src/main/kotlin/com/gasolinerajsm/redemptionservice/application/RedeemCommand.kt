package com.gasolinerajsm.redemptionservice.application

package com.gasolinerajsm.redemptionservice.application

import jakarta.validation.constraints.NotBlank

data class RedeemCommand(
    @field:NotBlank(message = "User ID cannot be blank") // Changed to NotBlank for String
    val userId: String, // Changed type to String

    @field:NotBlank(message = "QR token cannot be blank")
    val qrToken: String
)