package com.gasolinerajsm.coupon.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "qr.security")
data class QrSecurityProperties(
    var signatureSecret: String
)