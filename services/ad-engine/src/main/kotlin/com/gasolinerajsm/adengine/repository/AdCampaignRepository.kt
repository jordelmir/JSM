package com.gasolinerajsm.adengine.repository

import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import com.gasolinerajsm.adengine.model.AdCampaign



@Repository
interface AdCampaignRepository : JpaRepository<AdCampaign, Long> {
    fun findByAdvertiserId(advertiserId: String): List<AdCampaign>
}