
package com.gasolinerajsm.stationservice.repository

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import com.gasolinerajsm.stationservice.model.Station



@Repository
interface StationRepository : JpaRepository<Station, String>
