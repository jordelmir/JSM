package com.gasolinerajsm.integration

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.restassured.RestAssured
import io.restassured.http.ContentType
import org.hamcrest.Matchers.equalTo
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
import java.util.Date

@Testcontainers
@TestMethodOrder(OrderAnnotation::class)
class StationServiceIntegrationTest {

    companion object {
        private const val JWT_SECRET = "test_secret_key_for_integration_tests_123456"
        private var stationId: String = ""

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
            .setExpiration(Date(System.currentTimeMillis() + 600000)) // 10 minutes validity
            .signWith(SignatureAlgorithm.HS256, JWT_SECRET.toByteArray())
            .compact()
    }

    @Test
    @Order(1)
    fun `should create station successfully`() {
        val ownerToken = generateTestToken("owner-user", listOf("OWNER"))

        stationId = RestAssured.given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $ownerToken")
            .body("""{
                "name": "Integration Test Station",
                "latitude": 10.0,
                "longitude": -84.0
            }""")
            .post("/stations")
        .then()
            .statusCode(201)
            .body("id", notNull())
            .body("name", equalTo("Integration Test Station"))
            .extract()
            .path("id")
        
        println("Created station with ID: $stationId")
    }

    @Test
    @Order(2)
    fun `should get created station by id`() {
        val userToken = generateTestToken("test-user", listOf("USER"))

        RestAssured.given()
            .header("Authorization", "Bearer $userToken")
            .get("/stations/{id}", stationId)
        .then()
            .statusCode(200)
            .body("id", equalTo(stationId))
            .body("name", equalTo("Integration Test Station"))
    }

    @Test
    @Order(3)
    fun `should update station successfully`() {
        val ownerToken = generateTestToken("owner-user", listOf("OWNER"))

        RestAssured.given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $ownerToken")
            .body("""{
                "name": "Updated Test Station",
                "status": "INACTIVA"
            }""")
            .put("/stations/{id}", stationId)
        .then()
            .statusCode(200)
            .body("name", equalTo("Updated Test Station"))
            .body("status", equalTo("INACTIVA"))
    }

    @Test
    @Order(4)
    fun `should delete station successfully`() {
        val ownerToken = generateTestToken("owner-user", listOf("OWNER"))

        RestAssured.given()
            .header("Authorization", "Bearer $ownerToken")
            .delete("/stations/{id}", stationId)
        .then()
            .statusCode(204)
    }
}