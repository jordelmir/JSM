package com.gasolinerajsm.adengine.adapter.in.web

import com.gasolinerajsm.adengine.application.service.AdSelectionService
import com.gasolinerajsm.adengine.dto.AdCreativeResponse
import com.gasolinerajsm.adengine.dto.AdSelectionRequest
import com.gasolinerajsm.adengine.dto.ImpressionRequest
import com.gasolinerajsm.adengine.model.AdImpression
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import com.gasolinerajsm.common.api.ApiResponse // Import ApiResponse
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page
import org.springframework.kafka.core.KafkaTemplate // Import KafkaTemplate

@RestController
@RequestMapping("/ad")
class AdController(
    private val adSelectionService: AdSelectionService,
    private val kafkaTemplate: KafkaTemplate<String, ImpressionRequest>,
    @Value("\${spring.kafka.topics.ad-impressions}") private val impressionTopic: String
) {

    private val logger = LoggerFactory.getLogger(AdController::class.java)

    @PostMapping("/select")
    fun selectAd(@Valid @RequestBody request: AdSelectionRequest): ResponseEntity<ApiResponse<AdCreativeResponse>> {
        val adCreative = adSelectionService.selectAd(request)
        return ResponseEntity.ok(ApiResponse(data = adCreative)) // Wrap in ApiResponse
    }

    @PostMapping("/impression")
    fun recordImpression(@Valid @RequestBody request: ImpressionRequest): ResponseEntity<Void> {
        logger.info("Received impression request for session: {}", request.sessionId)
        kafkaTemplate.send(impressionTopic, request.sessionId, request) // Send to Kafka
        return ResponseEntity.accepted().build() // Return 202 Accepted
    }

    @GetMapping("/impressions")
    fun getImpressions(
        @RequestParam(required = false) campaignId: Long?,
        pageable: Pageable
    ): ResponseEntity<Page<AdImpression>> {
        val impressions = adSelectionService.getImpressions(campaignId, pageable)
        return ResponseEntity.ok(impressions)
    }

    @GetMapping("/impressions/count")
    fun countImpressions(): ResponseEntity<Long> {
        val count = adSelectionService.countImpressions()
        return ResponseEntity.ok(count)
    }
}
