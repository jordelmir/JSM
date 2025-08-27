package com.gasolinerajsm.authservice.controller

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
import org.springframework.web.bind.annotation.*
import java.util.concurrent.TimeUnit
import org.slf4j.LoggerFactory
import org.springframework.core.env.Environment

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService,
    private val jwtService: JwtService,
    private val redisTemplate: StringRedisTemplate,
    private val userService: UserService,
    private val env: Environment
) {

    private val logger = LoggerFactory.getLogger(AuthController::class.java)

        @PostMapping("/otp/request")
    fun requestOtp(@RequestBody request: OtpRequest): ResponseEntity<Void> {
        authService.sendOtp(request.phone)
        return ResponseEntity.ok().build()
    }

    @PostMapping("/otp/verify")
    fun verifyOtp(@RequestBody request: OtpVerifyRequest): ResponseEntity<TokenResponse> {
        val token = authService.verifyOtpAndIssueTokens(request.phone, request.otp)
        return ResponseEntity.ok(TokenResponse(token))
    }

    

    @PostMapping("/logout")
    fun logout(@RequestHeader("Authorization") token: String): ResponseEntity<Void> {
        val jwt = token.substring(7) // Remove "Bearer " prefix
        jwtService.blacklistToken(jwt)
        return ResponseEntity.ok().build()
    }
}