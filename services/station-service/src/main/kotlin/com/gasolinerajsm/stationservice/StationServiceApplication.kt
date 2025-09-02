package com.gasolinerajsm.stationservice

import com.gasolinerajsm.stationservice.config.StationProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(StationProperties::class)
class StationServiceApplication

fun main(args: Array<String>) {
    runApplication<StationServiceApplication>(*args)
}
