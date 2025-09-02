package com.gasolinerajsm.redemptionservice

import com.gasolinerajsm.redemptionservice.config.AdEngineClientProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(AdEngineClientProperties::class)
class RedemptionServiceApplication

fun main(args: Array<String>) {
    runApplication<RedemptionServiceApplication>(*args)
}
