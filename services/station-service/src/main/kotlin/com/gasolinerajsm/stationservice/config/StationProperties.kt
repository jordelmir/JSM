package com.gasolinerajsm.stationservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding // New import
import org.springframework.stereotype.Component

@ConstructorBinding // New annotation
@ConfigurationProperties(prefix = "station")
data class StationProperties(
    val idPrefix: String = "stn_" // Changed to val
)
