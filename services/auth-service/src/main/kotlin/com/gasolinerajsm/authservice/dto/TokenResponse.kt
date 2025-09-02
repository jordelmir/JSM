package com.gasolinerajsm.authservice.dto

/**
 * Data Transfer Object (DTO) representing the response containing authentication tokens.
 * @property accessToken The JWT access token used for authenticating subsequent requests.
 * @property refreshToken The refresh token used to obtain new access tokens when the current one expires.
 */
data class TokenResponse(val accessToken: String, val refreshToken: String)