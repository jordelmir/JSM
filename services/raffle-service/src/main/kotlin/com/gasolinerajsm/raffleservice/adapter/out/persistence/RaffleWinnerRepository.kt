package com.gasolinerajsm.raffleservice.adapter.out.persistence

import com.gasolinerajsm.raffleservice.model.RaffleWinner
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for managing RaffleWinner entities.
 * Extends JpaRepository to provide standard CRUD operations.
 */
@Repository
interface RaffleWinnerRepository : JpaRepository<RaffleWinner, Long> {
    /**
     * Finds a RaffleWinner entity by the raffle ID.
     * @param raffleId The ID of the raffle to find the winner for.
     * @return The RaffleWinner entity if found, or null otherwise.
     */
    fun findByRaffleId(raffleId: Long): RaffleWinner?
}