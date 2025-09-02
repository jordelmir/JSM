package com.gasolinerajsm.stationservice.controller

import com.gasolinerajsm.stationservice.dto.CreateStationDto
import com.gasolinerajsm.stationservice.dto.StationDto
import com.gasolinerajsm.stationservice.dto.UpdateStationDto
import com.gasolinerajsm.stationservice.service.StationService
import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/stations")
class StationController(private val stationService: StationService) {

    @GetMapping
    fun getAllStations(): List<StationDto> {
        return stationService.findAll()
    }

    @GetMapping("/nearby")
    fun getNearbyStations(
        @RequestParam @Min(-90) @Max(90) latitude: Double,
        @RequestParam @Min(-180) @Max(180) longitude: Double,
        @RequestParam(defaultValue = "5000") @Min(100) @Max(50000) distanceMeters: Int
    ): List<StationDto> {
        return stationService.findNearbyStations(longitude, latitude, distanceMeters)
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
