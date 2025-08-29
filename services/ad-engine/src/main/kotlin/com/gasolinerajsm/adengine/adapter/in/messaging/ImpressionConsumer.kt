package com.gasolinerajsm.adengine.adapter.in.messaging

import com.gasolinerajsm.adengine.dto.ImpressionRequest
import com.gasolinerajsm.adengine.model.AdImpression
import com.gasolinerajsm.adengine.repository.AdImpressionRepository
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component
import java.util.Date

@Component
class ImpressionConsumer(private val adImpressionRepository: AdImpressionRepository) {

    private val logger = LoggerFactory.getLogger(ImpressionConsumer::class.java)

    @KafkaListener(topics = ["ad-impressions-topic"], groupId = "ad-engine-group")
    fun listen(impressionRequest: ImpressionRequest) {
        logger.info("Received impression event for session: {}", impressionRequest.sessionId)
        try {
            val adImpression = AdImpression(
                userId = impressionRequest.userId,
                campaignId = impressionRequest.campaignId,
                creativeId = impressionRequest.creativeId,
                stationId = impressionRequest.stationId,
                sessionId = impressionRequest.sessionId,
                sequenceId = impressionRequest.sequenceId,
                duration = impressionRequest.duration,
                completed = impressionRequest.completed,
                skipped = impressionRequest.skipped,
                timestamp = Date() // Set current timestamp
            )
            adImpressionRepository.save(adImpression)
            logger.info("Successfully saved impression for session: {}", impressionRequest.sessionId)
        } catch (e: Exception) {
            logger.error("Error saving impression for session {}: {}", impressionRequest.sessionId, e.message, e)
            // Depending on requirements, consider dead-letter queue or retry mechanisms
        }
    }
}