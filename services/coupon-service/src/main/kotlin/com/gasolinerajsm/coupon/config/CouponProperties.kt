package com.gasolinerajsm.coupon.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding // New import
import org.springframework.stereotype.Component

@ConstructorBinding // New annotation
@ConfigurationProperties(prefix = "coupon")
data class CouponProperties(
    val expirationHours: Long = 24, // Changed to val
    val ticketRatio: Int = 5000, // New property for ticket calculation
    val uniqueTokenLength: Int = 12, // New property for unique token length
    val nextAdDuration: Int = 10 // New property for next ad duration
)
