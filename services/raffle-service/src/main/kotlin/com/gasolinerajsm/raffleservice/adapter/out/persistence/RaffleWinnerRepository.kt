package com.gasolinerajsm.raffleservice.adapter.out.persistence

import com.gasolinerajsm.raffleservice.model.RaffleWinner
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RaffleWinnerRepository : JpaRepository<RaffleWinner, Long> {
    fun findByRaffleId(raffleId: Long): RaffleWinner?
}
