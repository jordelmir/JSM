package com.gasolinerajsm.stationservice.dto

import com.gasolinerajsm.stationservice.model.StationStatus
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size

data class StationDto(val id: String, val name: String, val latitude: Double, val longitude: Double, val status: StationStatus)

data class CreateStationDto(
    @field:NotBlank(message = "{station.name.notBlank}")
    @field:Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    val name: String,

    @field:NotNull(message = "{station.latitude.notNull}")
    @field:Min(value = -90, message = "Latitude must be between -90 and 90")
    @field:Max(value = 90, message = "Latitude must be between -90 and 90")
    val latitude: Double,

    @field:NotNull(message = "{station.longitude.notNull}")
    @field:Min(value = -180, message = "{station.longitude.minMax}")
    @field:Max(value = 180, message = "{station.longitude.minMax}")
    val longitude: Double,

    val status: StationStatus = StationStatus.ACTIVA // Default status using enum
)

data class UpdateStationDto(
    @field:Size(min = 3, max = 100, message = "{station.name.size}")
    val name: String?,

        val latitude: Double?,

    @field:Min(value = -90, message = "{station.latitude.minMax}")
    @field:Max(value = 90, message = "{station.latitude.minMax}")
    val longitude: Double?,

    @field:Min(value = -180, message = "{station.longitude.minMax}")
    @field:Max(value = 180, message = "{station.longitude.minMax}")
    val longitude: Double?,

    val status: StationStatus? // Use enum
)