package com.gasolinerajsm.stationservice.controller

import com.gasolinerajsm.stationservice.service.StationService
import com.gasolinerajsm.stationservice.model.StationStatus
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

// --- DTOs ---
data class StationDto(val id: String, val name: String, val latitude: Double, val longitude: Double, val status: StationStatus)

data class CreateStationDto(
    @field:NotBlank(message = "Name cannot be blank")
    @field:Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    val name: String,

    @field:NotNull(message = "Latitude cannot be null")
    @field:Min(value = -90, message = "Latitude must be between -90 and 90")
    @field:Max(value = 90, message = "Latitude must be between -90 and 90")
    val latitude: Double,

    @field:NotNull(message = "Longitude cannot be null")
    @field:Min(value = -180, message = "Longitude must be between -180 and 180")
    @field:Max(value = 180, message = "Longitude must be between -180 and 180")
    val longitude: Double,

    val status: StationStatus = StationStatus.ACTIVA // Default status using enum
)

data class UpdateStationDto(
    @field:Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    val name: String?,

    @field:Min(value = -90, message = "Latitude must be between -90 and 90")
    @field:Max(value = 90, message = "Latitude must be between -90 and 90")
    val latitude: Double?,

    @field:Min(value = -180, message = "Longitude must be between -180 and 180")
    @field:Max(value = 180, message = "Longitude must be between -180 and 180")
    val longitude: Double?,

    val status: StationStatus? // Use enum
)

@RestController
@RequestMapping("/api/v1/stations") // Standardized API path
class StationController(private val stationService: StationService) {

    @GetMapping
    fun getAllStations(): List<StationDto> {
        return stationService.findAll()
    }

    @GetMapping("/{id}")
    fun getStationById(@PathVariable id: String): StationDto {
        return stationService.findById(id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createStation(@Valid @RequestBody stationDto: CreateStationDto): StationDto {
        return stationService.create(stationDto)
    }

    @PutMapping("/{id}")
    fun updateStation(@PathVariable id: String, @Valid @RequestBody stationDto: UpdateStationDto): StationDto {
        return stationService.update(id, stationDto)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteStation(@PathVariable id: String) {
        stationService.deleteById(id)
    }
}