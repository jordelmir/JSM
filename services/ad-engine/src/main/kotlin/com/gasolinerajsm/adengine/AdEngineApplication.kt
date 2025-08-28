package com.gasolinerajsm.adengine

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.cache.annotation.EnableCaching // Import EnableCaching

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableCaching // Enable caching
class AdEngineApplication

fun main(args: Array<String>) {
    runApplication<AdEngineApplication>(*args)
}
