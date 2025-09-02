package com.gasolinerajsm.stationservice.service

import com.gasolinerajsm.stationservice.config.StationProperties
import com.gasolinerajsm.stationservice.dto.CreateStationDto
import com.gasolinerajsm.stationservice.dto.StationDto
import com.gasolinerajsm.stationservice.dto.UpdateStationDto
import com.gasolinerajsm.stationservice.exception.StationNotFoundException
import com.gasolinerajsm.stationservice.model.Station
import com.gasolinerajsm.stationservice.repository.StationRepository
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class StationService(
    private val stationRepository: StationRepository,
    private val stationProperties: StationProperties
) {

    // WGS 84 coordinate system (SRID 4326)
    private val geometryFactory = GeometryFactory(PrecisionModel(), 4326)

    fun findById(id: String): StationDto {
        return stationRepository.findById(id)
            .map { it.toDto() }
            .orElseThrow { StationNotFoundException(id) }
    }

    fun findAll(): List<StationDto> {
        return stationRepository.findAll().map { it.toDto() }
    }

    fun findNearbyStations(longitude: Double, latitude: Double, distanceMeters: Int): List<StationDto> {
        return stationRepository.findStationsNearby(longitude, latitude, distanceMeters).map { it.toDto() }
    }

    @Transactional
    fun create(stationDto: CreateStationDto): StationDto {
        val locationPoint = geometryFactory.createPoint(Coordinate(stationDto.longitude, stationDto.latitude))
        val newStation = Station(
            id = stationProperties.idPrefix + UUID.randomUUID().toString(),
            name = stationDto.name,
            location = locationPoint,
            status = stationDto.status
        )
        val savedStation = stationRepository.save(newStation)
        return savedStation.toDto()
    }

    @Transactional
    fun update(id: String, stationDto: UpdateStationDto): StationDto {
        val existingStation = stationRepository.findById(id)
            .orElseThrow { StationNotFoundException(id) }

        stationDto.name?.let { existingStation.name = it }
        stationDto.status?.let { existingStation.status = it }

        if (stationDto.latitude != null && stationDto.longitude != null) {
            existingStation.location = geometryFactory.createPoint(Coordinate(stationDto.longitude, stationDto.latitude))
        }

        val updatedStation = stationRepository.save(existingStation)
        return updatedStation.toDto()
    }

    @Transactional
    fun deleteById(id: String) {
        try {
            stationRepository.deleteById(id)
        } catch (ex: EmptyResultDataAccessException) {
            throw StationNotFoundException(id)
        }
    }
}

// Helper extension function to map Entity to DTO
fun Station.toDto(): StationDto = StationDto(
    id = this.id,
    name = this.name,
    latitude = this.location.y,
    longitude = this.location.x,
    status = this.status
)
