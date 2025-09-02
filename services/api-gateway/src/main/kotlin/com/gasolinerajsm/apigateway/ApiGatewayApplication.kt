package com.gasolinerajsm.apigateway

import com.gasolinerajsm.apigateway.config.GatewayProperties // New import
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties // New import
import org.springframework.boot.runApplication

/**
 * Main entry point for the API Gateway application.
 * This class initializes and runs the Spring Boot application.
 * The ` @SpringBootApplication` annotation enables auto-configuration,
 * component scanning, and property support.
 */
 @SpringBootApplication
 @EnableConfigurationProperties(GatewayProperties::class) // New annotation
class ApiGatewayApplication

/**
 * The main function that starts the API Gateway application.
 *
 * @param args Command line arguments passed to the application.
 */
fun main(args: Array<String>) {
runApplication<ApiGatewayApplication>(*args)
}