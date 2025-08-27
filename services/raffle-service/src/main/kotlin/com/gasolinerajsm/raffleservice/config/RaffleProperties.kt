package com.gasolinerajsm.raffleservice.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "raffle")
data class RaffleProperties(
    var defaultPrize: String = "10000 Puntos G"
)
