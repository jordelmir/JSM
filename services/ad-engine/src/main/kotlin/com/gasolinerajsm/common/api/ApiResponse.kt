package com.gasolinerajsm.common.api

import java.time.LocalDateTime

data class ApiResponse<T>(
    val status: String = "success",
    val message: String? = null,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val data: T? = null
)