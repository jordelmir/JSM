package com.gasolinerajsm.adengine.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType

@Component
class OpenApiValidationFilter(private val objectMapper: ObjectMapper) : OncePerRequestFilter() {

    private val logger = LoggerFactory.getLogger(OpenApiValidationFilter::class.java)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val path = request.requestURI
        val method = request.method

        if (path == "/ad/select" && method == "POST") {
            if (!validateAdSelectionRequest(request, response)) return
        } else if (path == "/ad/impression" && method == "POST") {
            if (!validateImpressionRequest(request, response)) return
        }

        filterChain.doFilter(request, response)
    }

    private fun validateAdSelectionRequest(request: HttpServletRequest, response: HttpServletResponse): Boolean {
        val requestBody = request.reader.readText()
        if (requestBody.isBlank()) {
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Request body cannot be empty")
            return false
        }

        return try {
            val jsonNode = objectMapper.readTree(requestBody)
            val missingFields = mutableListOf<String>()

            if (!jsonNode.has("userId") || !jsonNode.get("userId").isNumber) missingFields.add("userId (number)")
            if (!jsonNode.has("stationId") || !jsonNode.get("stationId").isNumber) missingFields.add("stationId (number)")
            if (!jsonNode.has("sessionId") || !jsonNode.get("sessionId").isText) missingFields.add("sessionId (string)")

            if (missingFields.isNotEmpty()) {
                sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Missing or invalid fields: ${missingFields.joinToString(", ")}")
                false
            } else {
                true
            }
        } catch (e: Exception) {
            logger.error("Error parsing AdSelectionRequest body: {}", e.message)
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Invalid JSON format or structure")
            false
        }
    }

    private fun validateImpressionRequest(request: HttpServletRequest, response: HttpServletResponse): Boolean {
        val requestBody = request.reader.readText()
        if (requestBody.isBlank()) {
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Request body cannot be empty")
            return false
        }

        return try {
            val jsonNode = objectMapper.readTree(requestBody)
            val missingFields = mutableListOf<String>()

            if (!jsonNode.has("userId") || !jsonNode.get("userId").isNumber) missingFields.add("userId (number)")
            if (!jsonNode.has("campaignId") || !jsonNode.get("campaignId").isNumber) missingFields.add("campaignId (number)")
            if (!jsonNode.has("creativeId") || !jsonNode.get("creativeId").isText) missingFields.add("creativeId (string)")
            if (!jsonNode.has("stationId") || !jsonNode.get("stationId").isNumber) missingFields.add("stationId (number)")
            if (!jsonNode.has("sessionId") || !jsonNode.get("sessionId").isText) missingFields.add("sessionId (string)")
            if (!jsonNode.has("duration") || !jsonNode.get("duration").isNumber) missingFields.add("duration (number)")
            if (!jsonNode.has("completed") || !jsonNode.get("completed").isBoolean) missingFields.add("completed (boolean)")
            if (!jsonNode.has("skipped") || !jsonNode.get("skipped").isBoolean) missingFields.add("skipped (boolean)")

            if (missingFields.isNotEmpty()) {
                sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Missing or invalid fields: ${missingFields.joinToString(", ")}")
                false
            } else {
                true
            }
        } catch (e: Exception) {
            logger.error("Error parsing ImpressionRequest body: {}", e.message)
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Invalid JSON format or structure")
            false
        }
    }

    private fun sendErrorResponse(response: HttpServletResponse, status: HttpStatus, message: String) {
        response.status = status.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.writer.write(objectMapper.writeValueAsString(mapOf("error" to message)))
    }
}