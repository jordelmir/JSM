
package com.gasolinerajsm.stationservice.repository

import com.gasolinerajsm.stationservice.model.Station
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface StationRepository : JpaRepository<Station, String> {

    @Query(
        value = """
            SELECT * FROM stations s
            WHERE ST_DWithin(
                s.location,
                ST_MakePoint(:longitude, :latitude)::geography,
                :distanceMeters
            )
        """,
        nativeQuery = true
    )
    fun findStationsNearby(
        @Param("longitude") longitude: Double,
        @Param("latitude") latitude: Double,
        @Param("distanceMeters") distanceMeters: Int
    ): List<Station>
}
