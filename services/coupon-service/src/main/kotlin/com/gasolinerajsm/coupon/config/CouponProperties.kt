package com.gasolinerajsm.coupon.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "coupon")
data class CouponProperties(
    var expirationHours: Long = 24
)
