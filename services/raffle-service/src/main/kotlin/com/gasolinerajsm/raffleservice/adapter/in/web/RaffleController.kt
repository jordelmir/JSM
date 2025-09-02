package com.gasolinerajsm.raffleservice.adapter.in.web

import com.gasolinerajsm.raffleservice.adapter.in.web.dto.CreateRaffleRequest
import com.gasolinerajsm.raffleservice.adapter.in.web.dto.DrawRaffleRequest
import com.gasolinerajsm.raffleservice.adapter.in.web.dto.RaffleVerificationDetailsDto
import com.gasolinerajsm.raffleservice.application.RaffleCreationService
import com.gasolinerajsm.raffleservice.application.RaffleDrawingService
import com.gasolinerajsm.raffleservice.application.service.RaffleService
import com.gasolinerajsm.raffleservice.domain.model.Raffle
import com.gasolinerajsm.raffleservice.domain.model.RaffleWinner
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.util.UUID

@RestController
@RequestMapping("/raffles")
class RaffleController(
    private val raffleCreationService: RaffleCreationService,
    private val raffleDrawingService: RaffleDrawingService,
    private val raffleService: RaffleService // Injected main service
) {

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    fun createRaffle(@RequestBody request: CreateRaffleRequest): Mono<Raffle> {
        return raffleCreationService.createRaffle(request.period, request.pointEntries)
    }

    @PostMapping("/{raffleId}/draw")
    @PreAuthorize("hasRole('OWNER')")
    fun drawRaffle(
        @PathVariable raffleId: Long,
        @RequestBody request: DrawRaffleRequest
    ): Mono<RaffleWinner> {
        return raffleDrawingService.drawWinner(raffleId, request.clientSeed)
    }

    @GetMapping
    fun getAllRaffles(): Mono<List<Raffle>> {
        return raffleService.getAllRaffles()
    }

    @GetMapping("/{id}")
    fun getRaffleById(@PathVariable id: Long): Mono<Raffle> {
        return raffleService.getRaffleById(id)
    }

    @GetMapping("/{id}/winner")
    fun getRaffleWinner(@PathVariable id: Long): Mono<RaffleWinner> {
        return raffleService.getWinnerForRaffle(id)
    }

    @GetMapping("/{id}/verify")
    fun getRaffleVerificationDetails(@PathVariable id: Long): Mono<RaffleVerificationDetailsDto> {
        return raffleService.getVerificationDetails(id)
    }
}
