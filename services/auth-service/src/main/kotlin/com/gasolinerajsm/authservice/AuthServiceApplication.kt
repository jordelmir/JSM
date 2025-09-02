package com.gasolinerajsm.authservice

import com.gasolinerajsm.authservice.config.CorsProperties // New import
import com.gasolinerajsm.authservice.config.JwtProperties // New import
import com.gasolinerajsm.authservice.config.OtpProperties // New import
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties // New import
import org.springframework.boot.runApplication

/**
 * Main entry point for the Auth Service Spring Boot application.
 * This class enables Spring Boot's auto-configuration, component scanning, and configuration properties.
 */
@SpringBootApplication
@EnableConfigurationProperties(JwtProperties::class, OtpProperties::class, CorsProperties::class) // Modified annotation
class AuthServiceApplication

/**
 * The main function that starts the Auth Service application.
 * @param args Command line arguments passed to the application.
 */
fun main(args: Array<String>) {
    runApplication<AuthServiceApplication>(*args)
}