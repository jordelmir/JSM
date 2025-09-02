package com.gasolinerajsm.authservice.adapter.in.web

import com.gasolinerajsm.authservice.dto.OtpRequest
import com.gasolinerajsm.authservice.dto.OtpVerifyRequest
import com.gasolinerajsm.authservice.dto.TokenResponse // Fixed import
import com.gasolinerajsm.authservice.service.AuthService // Fixed import
import com.gasolinerajsm.authservice.service.JwtService

import jakarta.validation.Valid

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import com.gasolinerajsm.common.api.ApiResponse // Fixed import
import org.springframework.web.bind.annotation.*
import java.util.concurrent.TimeUnit
import org.slf4j.LoggerFactory


/**
 * REST Controller for handling authentication-related API requests.
 * Provides endpoints for OTP requests, OTP verification, and user logout.
 */
@RestController
@RequestMapping("/auth") // Added API versioning
class AuthController(
    private val authService: AuthService,
    private val jwtService: JwtService
) {

    private val logger = LoggerFactory.getLogger(AuthController::class.java)

    /**
     * Handles requests to send an OTP (One-Time Password) to a user's phone number.
     * @param request The OtpRequest containing the phone number.
     * @return ResponseEntity with ApiResponse indicating success.
     */
    @PostMapping("/otp/request")
    fun requestOtp(@RequestBody request: OtpRequest): ResponseEntity<ApiResponse<Void>> {
        authService.sendOtp(request.phone)
        return ResponseEntity.ok(ApiResponse(message = "OTP requested successfully")) // Wrap in ApiResponse
    }

    /**
     * Handles requests to verify an OTP and issue authentication tokens.
     * @param request The OtpVerifyRequest containing the phone number and OTP code.
     * @return ResponseEntity with ApiResponse containing the generated TokenResponse.
     */
    @PostMapping("/otp/verify")
    fun verifyOtp(@RequestBody request: OtpVerifyRequest): ResponseEntity<ApiResponse<TokenResponse>> {
        val token = authService.verifyOtpAndIssueTokens(request.phone, request.otp)
        return ResponseEntity.ok(ApiResponse(data = token)) // Wrap in ApiResponse
    }

    /**
     * Handles user logout by blacklisting their JWT token.
     * @param token The Authorization header containing the Bearer JWT token.
     * @return ResponseEntity with ApiResponse indicating success.
     */
    @PostMapping("/logout")
    fun logout(@RequestHeader("Authorization") token: String): ResponseEntity<ApiResponse<Void>> {
        val jwt = token.substring(7) // Remove "Bearer " prefix
        jwtService.blacklistToken(jwt)
        package com.gasolinerajsm.authservice.adapter.in.web

import com.gasolinerajsm.authservice.application.service.AuthService
import com.gasolinerajsm.authservice.application.service.JwtService
import com.gasolinerajsm.authservice.dto.OtpRequest
import com.gasolinerajsm.authservice.dto.OtpVerifyRequest
import com.gasolinerajsm.authservice.dto.RefreshTokenRequest
import com.gasolinerajsm.authservice.dto.TokenResponse
import com.gasolinerajsm.common.api.ApiResponse
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService,
    private val jwtService: JwtService
) {

    private val logger = LoggerFactory.getLogger(AuthController::class.java)

    @PostMapping("/otp/request")
    fun requestOtp(@Valid @RequestBody request: OtpRequest): ResponseEntity<ApiResponse<Void>> {
        authService.sendOtp(request.phone)
        return ResponseEntity.ok(ApiResponse(message = "OTP sent successfully"))
    }

    @PostMapping("/otp/verify")
    fun verifyOtp(@Valid @RequestBody request: OtpVerifyRequest): ResponseEntity<ApiResponse<TokenResponse>> {
        val tokens = authService.verifyOtpAndIssueTokens(request.phone, request.otp)
        return ResponseEntity.ok(ApiResponse(data = tokens))
    }

    @PostMapping("/refresh")
    fun refreshToken(@Valid @RequestBody request: RefreshTokenRequest): ResponseEntity<ApiResponse<TokenResponse>> {
        val tokens = authService.refreshAccessToken(request.refreshToken)
        return ResponseEntity.ok(ApiResponse(data = tokens))
    }

    @PostMapping("/logout")
    fun logout(@RequestHeader("Authorization") token: String): ResponseEntity<ApiResponse<Void>> {
        val jwt = token.substringAfter("Bearer ")
        jwtService.blacklistToken(jwt)
        return ResponseEntity.ok(ApiResponse(message = "Logged out successfully"))
    }
}
