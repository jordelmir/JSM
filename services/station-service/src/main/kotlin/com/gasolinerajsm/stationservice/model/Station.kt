package com.gasolinerajsm.stationservice.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.Point

@Entity
@Table(name = "stations")
data class Station(
    @Id
    val id: String,
    var name: String,

    @Column(columnDefinition = "geography(Point, 4326)")
    var location: Point,

    @Enumerated(EnumType.STRING)
    var status: StationStatus
)
