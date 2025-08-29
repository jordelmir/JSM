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
import java.util.UUID

@Testcontainers
@TestMethodOrder(OrderAnnotation::class)
class CouponServiceIntegrationTest {

    companion object {
        private const val JWT_SECRET = "test_secret_key_for_integration_tests_123456"
        private var qrCode: String = ""
        private var couponId: String = ""
        private val stationId = UUID.randomUUID().toString()
        private val employeeId = UUID.randomUUID().toString()
        private val userId = UUID.randomUUID().toString()

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
    fun `should generate a coupon`() {
        val employeeToken = generateTestToken(employeeId, listOf("EMPLOYEE"))

        val response = RestAssured.given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $employeeToken")
            .body("""{
                "stationId": "$stationId",
                "employeeId": "$employeeId",
                "amount": 15000
            }""")
            .post("/coupons")
        .then()
            .statusCode(201)
            .body("data.couponId", notNull())
            .body("data.qrCode", notNull())
            .body("data.baseTickets", equalTo(3))
            .extract()
            .path("data")

        couponId = response["couponId"]
        qrCode = response["qrCode"]
        println("Generated coupon $couponId with QR: $qrCode")
    }

    @Test
    @Order(2)
    fun `should scan the generated coupon`() {
        val clientToken = generateTestToken(userId, listOf("CLIENT"))

        RestAssured.given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $clientToken")
            .body("""{
                "qrCode": "$qrCode",
                "userId": "$userId"
            }""")
            .post("/coupons/scan")
        .then()
            .statusCode(200)
            .body("data.couponId", equalTo(couponId))
            .body("data.canActivate", equalTo(true))
    }

    @Test
    @Order(3)
    fun `should activate the scanned coupon`() {
        val clientToken = generateTestToken(userId, listOf("CLIENT"))

        RestAssured.given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer $clientToken")
            .body("""{
                "userId": "$userId"
            }""")
            .post("/coupons/{id}/activation", couponId)
        .then()
            .statusCode(200)
            .body("data.couponId", equalTo(couponId))
            .body("data.message", equalTo("¡Cupón activado! Mira el anuncio para duplicar tus tickets."))
    }
}