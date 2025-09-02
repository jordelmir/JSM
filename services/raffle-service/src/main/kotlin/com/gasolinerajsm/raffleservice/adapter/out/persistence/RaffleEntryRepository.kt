package com.gasolinerajsm.raffleservice.adapter.out.persistence

import com.gasolinerajsm.raffleservice.model.RaffleEntry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for managing RaffleEntry entities.
 * Extends JpaRepository to provide standard CRUD operations.
 */
@Repository
interface RaffleEntryRepository : JpaRepository<RaffleEntry, Long> {
    /**
     * Finds all RaffleEntry entities for a given raffle ID.
     * @param raffleId The ID of the raffle to find entries for.
     * @return A list of RaffleEntry entities.
     */
    fun findByRaffleId(raffleId: Long): List<RaffleEntry>
}