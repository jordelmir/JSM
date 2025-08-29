package com.gasolinerajsm.integration

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.restassured.RestAssured
import io.restassured.http.ContentType
import org.hamcrest.Matchers.notNull
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.junit.jupiter.api.Order
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.DockerComposeContainer
import org.testcontainers.containers.wait.strategy.Wait
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.io.File
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Date

@Testcontainers
@TestMethodOrder(OrderAnnotation::class)
class RaffleServiceIntegrationTest {

    companion object {
        private const val JWT_SECRET = "test_secret_key_for_integration_tests_123456"

        @Container
        @JvmField
        val container: DockerComposeContainer<*> = DockerComposeContainer(File("../../docker-compose.yml"))
            .withExposedService("api-gateway_1", 8080, Wait.forHttp("/actuator/health").forStatusCode(200))

        @JvmStatic
        @DynamicPropertySource
        fun setProperties(registry: DynamicPropertyRegistry) {
            val apiGatewayPort = container.getServicePort("api-gateway_1", 8080)
            RestAssured.port = apiGatewayPort
            RestAssured.baseURI = "http://localhost"
        }
    }

    fun generateTestToken(userId: String, roles: List<String>): String {
        val claims = mapOf("sub" to userId, "roles" to roles)
        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + 600000))
            .signWith(SignatureAlgorithm.HS256, JWT_SECRET.toByteArray())
            .compact()
    }

    @Test
    @Order(1)
    fun `should close raffle period asynchronously`() {
        val ownerToken = generateTestToken("owner-user", listOf("OWNER"))
        val today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)

        // Nota: Este test asume que hay puntos/tickets en la DB para el período actual.
        // Un test más completo requeriría un seeder de datos.
        RestAssured.given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $ownerToken")
            .post("/raffles/{period}/close", today)
        .then()
            .statusCode(202) // 202 Accepted for async operation
            .body("jobId", notNull())
            .body("statusUrl", notNull())
    }
}