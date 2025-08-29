package com.gasolinerajsm.adengine.adapter.in.web

import com.gasolinerajsm.adengine.service.CampaignPerformanceSummaryDto
import com.gasolinerajsm.adengine.service.CampaignService
import jakarta.validation.Valid
import jakarta.validation.constraints.FutureOrPresent
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.time.LocalDate

import com.gasolinerajsm.adengine.dto.CampaignDto
import com.gasolinerajsm.adengine.dto.CreateCampaignDto

@RestController
@RequestMapping("/campaigns")
@PreAuthorize("hasRole('ADVERTISER')")
class CampaignController(private val campaignService: CampaignService) {

    @GetMapping
    fun getMyCampaigns(principal: Principal): List<CampaignDto> {
        val advertiserId = principal.name
        return campaignService.getCampaignsForAdvertiser(advertiserId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createCampaign(@Valid @RequestBody campaignDto: CreateCampaignDto, principal: Principal): CampaignDto {
        val advertiserId = principal.name
        return campaignService.createCampaign(advertiserId, campaignDto)
    }

    @GetMapping("/summary")
    fun getCampaignPerformanceSummary(principal: Principal): CampaignPerformanceSummaryDto {
        val advertiserId = principal.name
        return campaignService.getPerformanceSummaryForAdvertiser(advertiserId)
    }

    // PUT and DELETE endpoints would follow a similar pattern
}
