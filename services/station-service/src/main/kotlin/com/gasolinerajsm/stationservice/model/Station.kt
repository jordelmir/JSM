package com.gasolinerajsm.stationservice.model

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Enumerated
import jakarta.persistence.EnumType

@Entity
@Table(name = "stations")
data class Station(
    @Id
    var id: String,
    var name: String,
    var latitude: Double,
    var longitude: Double,
    @Enumerated(EnumType.STRING) // Store enum as String in DB
    var status: StationStatus
)
