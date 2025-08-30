package com.gasolinerajsm.shared.api

import java.time.LocalDateTime

data class ErrorResponse(
    val timestamp: LocalDateTime,
    val status: Int,
    val error: String,
    val message: String,
    val path: String? = null,
    val method: String? = null // Make method nullable for services that don't use it
)
