package com.gasolinerajsm.adengine.service

import com.gasolinerajsm.adengine.dto.AdCreativeResponse
import com.gasolinerajsm.adengine.dto.AdSelectionRequest
import com.gasolinerajsm.adengine.exception.NoActiveCampaignFoundException // Import the new exception
import com.gasolinerajsm.adengine.repository.CampaignRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import kotlin.random.Random // Import Random

import io.micrometer.core.instrument.MeterRegistry // Import Micrometer

import org.springframework.cache.annotation.Cacheable // Import Cacheable

@Service
class AdSelectionService(
    private val campaignRepository: CampaignRepository,
    @Value("\${ad.fallback.url}")
    private val fallbackAdUrl: String,
    private val meterRegistry: MeterRegistry // Inject MeterRegistry
) {

    private val logger = LoggerFactory.getLogger(AdSelectionService::class.java)

    @Cacheable(value = ["activeCampaigns"], key = "#request.stationId")
    fun selectAd(request: AdSelectionRequest): AdCreativeResponse {
        val activeCampaigns = campaignRepository.findActiveCampaignsForStation(
            request.stationId
        )

        return if (activeCampaigns.isNotEmpty()) {
            // --- Start: More sophisticated selection logic ---
            val totalWeight = activeCampaigns.sumOf { it.weight } // Assuming 'weight' field in Campaign
            if (totalWeight == 0) {
                logger.warn("No weight defined for active campaigns for station {}. Falling back to simple first selection.", request.stationId)
                val selectedCampaign = activeCampaigns.first()
                AdCreativeResponse(
                    adUrl = selectedCampaign.adUrl,
                    campaignId = selectedCampaign.id,
                    creativeId = "creative-${selectedCampaign.id}"
                )
            } else {
                var randomValue = Random.nextDouble() * totalWeight
                val selectedCampaign = activeCampaigns.first { campaign ->
                    randomValue -= campaign.weight
                    randomValue <= 0
                }
                logger.info("Selected campaign {} (weighted) for station {} and user {}", selectedCampaign.id, request.stationId, request.userId)
                AdCreativeResponse(
                    adUrl = selectedCampaign.adUrl,
                    campaignId = selectedCampaign.id,
                    creativeId = "creative-${selectedCampaign.id}"
                )
            }
            meterRegistry.counter("ad_selection.success", "station_id", request.stationId.toString()).increment()
            // --- End: More sophisticated selection logic ---
        } else {
            logger.warn("No active campaigns found for station {}. Throwing exception.", request.stationId)
            meterRegistry.counter("ad_selection.fallback", "station_id", request.stationId.toString()).increment()
            throw NoActiveCampaignFoundException(request.stationId) // Throw custom exception
        }
    }
}