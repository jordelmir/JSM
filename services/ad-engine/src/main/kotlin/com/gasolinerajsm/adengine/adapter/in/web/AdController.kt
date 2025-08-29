package com.gasolinerajsm.adengine.adapter.in.web

import com.gasolinerajsm.adengine.dto.AdCreativeResponse
import com.gasolinerajsm.adengine.dto.AdSelectionRequest
import com.gasolinerajsm.adengine.dto.ImpressionRequest
import com.gasolinerajsm.adengine.model.AdImpression
import com.gasolinerajsm.adengine.repository.AdImpressionRepository
import com.gasolinerajsm.adengine.service.AdSelectionService
import jakarta.validation.Valid
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
    private val adImpressionRepository: AdImpressionRepository,
    private val kafkaTemplate: KafkaTemplate<String, ImpressionRequest> // Inject KafkaTemplate
) {

    private val logger = LoggerFactory.getLogger(AdController::class.java)

    companion object {
        private const val IMPRESSION_TOPIC = "ad-impressions-topic"
    }

    @PostMapping("/select")
    fun selectAd(@Valid @RequestBody request: AdSelectionRequest): ResponseEntity<ApiResponse<AdCreativeResponse>> {
        val adCreative = adSelectionService.selectAd(request)
        return ResponseEntity.ok(ApiResponse(data = adCreative)) // Wrap in ApiResponse
    }

    @PostMapping("/impression")
    fun recordImpression(@Valid @RequestBody request: ImpressionRequest): ResponseEntity<Void> {
        logger.info("Received impression request for session: {}", request.sessionId)
        kafkaTemplate.send(IMPRESSION_TOPIC, request.sessionId, request) // Send to Kafka
        return ResponseEntity.accepted().build() // Return 202 Accepted
    }

    @GetMapping("/impressions")
    fun getImpressions(
        @RequestParam(required = false) campaignId: Long?,
        pageable: Pageable
    ): ResponseEntity<Page<AdImpression>> {
        logger.info("Received request to get impressions. CampaignId filter: {}, Pageable: {}", campaignId ?: "none", pageable)
        val impressions = if (campaignId != null) {
            adImpressionRepository.findByCampaignId(campaignId, pageable)
        } else {
            adImpressionRepository.findAll(pageable)
        }
        return ResponseEntity.ok(impressions)
    }

    @GetMapping("/impressions/count")
    fun countImpressions(): ResponseEntity<Long> {
        val count = adImpressionRepository.count()
        logger.info("Total impressions count requested: {}", count)
        return ResponseEntity.ok(count)
    }
}
