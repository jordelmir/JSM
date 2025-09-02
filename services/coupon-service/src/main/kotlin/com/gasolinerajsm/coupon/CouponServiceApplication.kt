package com.gasolinerajsm.coupon

import com.gasolinerajsm.coupon.config.CouponProperties // New import
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties // New import
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

/**
 * Main entry point for the Coupon Service Spring Boot application.
 * This class enables Spring Boot's auto-configuration, component scanning, and JPA auditing.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties(CouponProperties::class) // New annotation
class CouponServiceApplication

/**
 * The main function that starts the Coupon Service application.
 * @param args Command line arguments passed to the application.
 */
fun main(args: Array<String>) {
    runApplication<CouponServiceApplication>(*args)
}
