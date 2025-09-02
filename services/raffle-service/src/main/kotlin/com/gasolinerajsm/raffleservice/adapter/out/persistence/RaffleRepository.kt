package com.gasolinerajsm.raffleservice.adapter.out.persistence

import com.gasolinerajsm.raffleservice.model.Raffle
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for managing Raffle entities.
 * Extends JpaRepository to provide standard CRUD operations.
 */
@Repository
interface RaffleRepository : JpaRepository<Raffle, Long> {
    /**
     * Finds a Raffle entity by its period.
     * @param period The period of the raffle to find.
     * @return The Raffle entity if found, or null otherwise.
     */
    fun findByPeriod(period: String): Raffle?
}