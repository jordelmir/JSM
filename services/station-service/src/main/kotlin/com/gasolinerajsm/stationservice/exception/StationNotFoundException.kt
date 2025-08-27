package com.gasolinerajsm.stationservice.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class StationNotFoundException(id: String) : RuntimeException("Station with ID $id not found")
