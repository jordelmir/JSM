package com.gasolinerajsm.raffleservice.adapter.out.persistence

import com.gasolinerajsm.raffleservice.model.RaffleEntry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RaffleEntryRepository : JpaRepository<RaffleEntry, Long> {
    fun findByRaffleId(raffleId: Long): List<RaffleEntry>
}
