
package com.gasolinerajsm.adengine.application.service

import com.gasolinerajsm.adengine.dto.CampaignDto
import com.gasolinerajsm.adengine.dto.CreateCampaignDto
import com.gasolinerajsm.adengine.repository.AdCampaign
import com.gasolinerajsm.adengine.repository.AdCampaignRepository
import com.gasolinerajsm.adengine.repository.AdImpressionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import jakarta.persistence.EntityNotFoundException

data class CampaignPerformanceSummaryDto(
    val totalImpressions: Long,
    val totalBudgetSpent: Double
)

import org.springframework.cache.annotation.Cacheable // Import Cacheable
import org.springframework.cache.annotation.CacheEvict // Import CacheEvict

@Service
class CampaignService(
    private val adCampaignRepository: AdCampaignRepository,
    private val adImpressionRepository: AdImpressionRepository
) {

    @Cacheable(value = ["advertiserCampaigns"], key = "#advertiserId")
    fun getCampaignsForAdvertiser(advertiserId: String): List<CampaignDto> {
        return adCampaignRepository.findByAdvertiserId(advertiserId).map { it.toDto() }
    }

    @Transactional
    @CacheEvict(value = ["advertiserCampaigns", "campaignPerformanceSummary"], key = "#advertiserId", allEntries = false)
    fun createCampaign(advertiserId: String, dto: CreateCampaignDto): CampaignDto {
        val campaign = AdCampaign(
            name = dto.name,
            advertiserId = advertiserId,
            startDate = dto.startDate,
            endDate = dto.endDate,
            budget = dto.budget,
            adUrl = dto.adUrl
        )
        val savedCampaign = adCampaignRepository.save(campaign)
        return savedCampaign.toDto()
    }

    @Transactional
    @CacheEvict(value = ["advertiserCampaigns", "campaignPerformanceSummary"], key = "#advertiserId", allEntries = false)
    fun updateCampaign(campaignId: Long, advertiserId: String, dto: CreateCampaignDto): CampaignDto {
        val campaign = adCampaignRepository.findById(campaignId)
            .orElseThrow { EntityNotFoundException("Campaign with id $campaignId not found") }

        if (campaign.advertiserId != advertiserId) {
            // Or throw a more specific AccessDeniedException
            throw SecurityException("User does not have permission to update this campaign")
        }

        // Update properties
        campaign.name = dto.name
        campaign.startDate = dto.startDate
        campaign.endDate = dto.endDate
        campaign.budget = dto.budget
        campaign.adUrl = dto.adUrl

        val updatedCampaign = adCampaignRepository.save(campaign)
        return updatedCampaign.toDto()
    }

    @Cacheable(value = ["campaignPerformanceSummary"], key = "#advertiserId")
    fun getPerformanceSummaryForAdvertiser(advertiserId: String): CampaignPerformanceSummaryDto {
        // TODO: Implement real aggregation logic
        // For now, return mock data
        val campaigns = adCampaignRepository.findByAdvertiserId(advertiserId)
        val totalBudgetSpent = campaigns.sumOf { it.budget }
        val totalImpressions = adImpressionRepository.countByAdvertiserId(advertiserId) // Assuming this method exists

        return CampaignPerformanceSummaryDto(
            totalImpressions = totalImpressions,
            totalBudgetSpent = totalBudgetSpent
        )
    }
}

fun AdCampaign.toDto(): CampaignDto = CampaignDto(
    id = this.id!!,
    name = this.name,
    startDate = this.startDate,
    endDate = this.endDate,
    budget = this.budget,
    adUrl = this.adUrl
)
