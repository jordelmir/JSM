package com.gasolinerajsm.stationservice.service

import com.gasolinerajsm.stationservice.controller.CreateStationDto
import com.gasolinerajsm.stationservice.controller.StationDto
import com.gasolinerajsm.stationservice.controller.UpdateStationDto
import com.gasolinerajsm.stationservice.exception.StationNotFoundException
import com.gasolinerajsm.stationservice.model.Station
import com.gasolinerajsm.stationservice.model.StationStatus // Import enum
import com.gasolinerajsm.stationservice.repository.StationRepository
import org.springframework.dao.EmptyResultDataAccessException // Import this
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID
import com.gasolinerajsm.stationservice.config.StationProperties // Import new properties

@Service
class StationService(
    private val stationRepository: StationRepository,
    private val stationProperties: StationProperties // Inject properties
) {

    fun findById(id: String): StationDto {
        return stationRepository.findById(id)
            .map { it.toDto() }
            .orElseThrow { StationNotFoundException(id) } // Use custom exception
    }

    fun findAll(): List<StationDto> {
        return stationRepository.findAll().map { it.toDto() }
    }

    @Transactional
    fun create(stationDto: CreateStationDto): StationDto {
        val newStation = stationDto.toEntity(stationProperties.idPrefix + UUID.randomUUID().toString())
        val savedStation = stationRepository.save(newStation)
        return savedStation.toDto()
    }

    @Transactional
    fun update(id: String, stationDto: UpdateStationDto): StationDto {
        val existingStation = stationRepository.findById(id)
            .orElseThrow { StationNotFoundException(id) }

        existingStation.name = stationDto.name ?: existingStation.name
        existingStation.latitude = stationDto.latitude ?: existingStation.latitude
        existingStation.longitude = stationDto.longitude ?: existingStation.longitude
        existingStation.status = stationDto.status ?: existingStation.status

        val updatedStation = stationRepository.save(existingStation)
        return updatedStation.toDto()
    }

    @Transactional
    fun deleteById(id: String) {
        try {
            stationRepository.deleteById(id)
        } catch (ex: EmptyResultDataAccessException) {
            throw StationNotFoundException(id) // Convert to custom exception
        }
    }
}

// Helper extension function to map DTO to Entity
fun CreateStationDto.toEntity(id: String): Station = Station(
    id = id,
    name = this.name,
    latitude = this.latitude,
    longitude = this.longitude,
    status = this.status
)

// Helper extension function to map Entity to DTO
fun Station.toDto(): StationDto = StationDto(
    id = this.id,
    name = this.name,
    latitude = this.latitude,
    longitude = this.longitude,
    status = this.status
)