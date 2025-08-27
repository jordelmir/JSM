package com.gasolinerajsm.adengine.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class NoActiveCampaignFoundException(stationId: String) : RuntimeException("No active campaign found for station ID: $stationId")
