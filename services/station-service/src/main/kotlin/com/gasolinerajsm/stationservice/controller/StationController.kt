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
import com.gasolinerajsm.stationservice.dto.StationDto
import com.gasolinerajsm.stationservice.dto.CreateStationDto
import com.gasolinerajsm.stationservice.dto.UpdateStationDto



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