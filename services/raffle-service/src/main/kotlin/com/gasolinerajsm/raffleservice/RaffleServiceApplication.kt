package com.gasolinerajsm.raffleservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Main entry point for the Raffle Service Spring Boot application.
 * This class enables Spring Boot's auto-configuration, component scanning, and configuration properties.
 */
@SpringBootApplication
class RaffleServiceApplication

/**
 * The main function that starts the Raffle Service application.
 * @param args Command line arguments passed to the application.
 */
fun main(args: Array<String>) {
    runApplication<RaffleServiceApplication>(*args)
}
