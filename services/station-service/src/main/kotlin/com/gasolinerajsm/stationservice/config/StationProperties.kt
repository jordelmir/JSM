package com.gasolinerajsm.stationservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "station")
data class StationProperties(
    var idPrefix: String = "stn_"
)
