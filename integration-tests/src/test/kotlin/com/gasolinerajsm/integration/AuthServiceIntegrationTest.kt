package com.gasolinerajsm.integration

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

@Testcontainers
@TestMethodOrder(OrderAnnotation::class)
class AuthServiceIntegrationTest {

    companion object {
        // En un test real, este OTP sería obtenido de un servicio de mocking o una DB de test
        private const val MOCK_OTP = "123456"
        private const val TEST_PHONE_NUMBER = "+50688888888"

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

    @Test
    @Order(1)
    fun `should request OTP successfully`() {
        RestAssured.given()
            .contentType(ContentType.JSON)
            .body("""{
                "phone": "$TEST_PHONE_NUMBER"
            }""")
            .post("/auth/otp/request")
        .then()
            .statusCode(200)
    }

    @Test
    @Order(2)
    fun `should verify OTP and receive tokens`() {
        RestAssured.given()
            .contentType(ContentType.JSON)
            .body("""{
                "phone": "$TEST_PHONE_NUMBER",
                "otp": "$MOCK_OTP"
            }""")
            .post("/auth/otp/verify")
        .then()
            .statusCode(200)
            .body("accessToken", notNull())
            .body("refreshToken", notNull())
    }
}