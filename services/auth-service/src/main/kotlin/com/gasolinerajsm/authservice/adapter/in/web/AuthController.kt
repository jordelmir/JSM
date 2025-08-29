package com.gasolinerajsm.authservice.adapter.in.web

import com.gasolinerajsm.authservice.dto.AdminLoginRequest
import com.gasolinerajsm.authservice.dto.OtpRequest
import com.gasolinerajsm.authservice.dto.OtpVerifyRequest
import com.gasolinerajsm.authservice.dto.TokenResponse
import com.gasolinerajsm.authservice.service.JwtService
import com.gasolinerajsm.authservice.service.UserService
import jakarta.validation.Valid
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import com.gasolinerajsm.common.api.ApiResponse // Import ApiResponse
import org.springframework.web.bind.annotation.*
import java.util.concurrent.TimeUnit
import org.slf4j.LoggerFactory
import org.springframework.core.env.Environment

@RestController
@RequestMapping("/auth") // Added API versioning
class AuthController(
    private val authService: AuthService,
    private val jwtService: JwtService,
    private val redisTemplate: StringRedisTemplate,
    private val userService: UserService,
    private val env: Environment
) {

    private val logger = LoggerFactory.getLogger(AuthController::class.java)

        @PostMapping("/otp/request")
    fun requestOtp(@RequestBody request: OtpRequest): ResponseEntity<ApiResponse<Void>> {
        authService.sendOtp(request.phone)
        return ResponseEntity.ok(ApiResponse(message = "OTP requested successfully")) // Wrap in ApiResponse
    }

    @PostMapping("/otp/verify")
    fun verifyOtp(@RequestBody request: OtpVerifyRequest): ResponseEntity<ApiResponse<TokenResponse>> {
        val token = authService.verifyOtpAndIssueTokens(request.phone, request.otp)
        return ResponseEntity.ok(ApiResponse(data = TokenResponse(token))) // Wrap in ApiResponse
    }

    

    @PostMapping("/logout")
    fun logout(@RequestHeader("Authorization") token: String): ResponseEntity<ApiResponse<Void>> {
        val jwt = token.substring(7) // Remove "Bearer " prefix
        jwtService.blacklistToken(jwt)
        return ResponseEntity.ok(ApiResponse(message = "Logged out successfully")) // Wrap in ApiResponse
    }
}