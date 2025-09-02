package com.gasolinerajsm.redemptionservice.adapter.in.web

import com.gasolinerajsm.redemptionservice.application.RedemptionService
import com.gasolinerajsm.redemptionservice.service.QrSecurityService
import com.gasolinerajsm.redemptionservice.application.RedeemCommand
import com.gasolinerajsm.redemptionservice.application.RedemptionResult
import com.gasolinerajsm.redemptionservice.application.ConfirmAdRequest
import com.gasolinerajsm.redemptionservice.application.ConfirmAdResponse
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.Authentication

package com.gasolinerajsm.redemptionservice.adapter.in.web

import com.gasolinerajsm.redemptionservice.application.RedemptionService
import com.gasolinerajsm.redemptionservice.service.QrSecurityService
import com.gasolinerajsm.redemptionservice.application.RedeemCommand
import com.gasolinerajsm.redemptionservice.application.RedemptionResult
import com.gasolinerajsm.redemptionservice.application.ConfirmAdRequest
import com.gasolinerajsm.redemptionservice.application.ConfirmAdResponse
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.Authentication

@RestController
@RequestMapping("/redeem")
class RedemptionController(
    private val redemptionService: RedemptionService,
    private val qrSecurityService: QrSecurityService
) {

    private fun getUserId(): String {
        val authentication: Authentication = SecurityContextHolder.getContext().authentication
        return authentication.name // Assuming the principal name is the userId
    }

    @PostMapping
    fun redeem(@Valid @RequestBody command: RedeemCommand): RedemptionResult {
        val qrPayload = qrSecurityService.validateAndParseToken(command.qrToken)
        val userId = getUserId()
        return redemptionService.initiateRedemption(userId, command)
    }

    @PostMapping("/confirm-ad")
    fun confirmAd(@Valid @RequestBody request: ConfirmAdResponse): ConfirmAdResponse {
        val userId = getUserId()
        return redemptionService.confirmAdWatched(userId, request)
    }

    @GetMapping("/points-redeemed/count")
    fun countPointsRedeemed(): ResponseEntity<Long> {
        val count = redemptionService.countTotalPointsRedeemed()
        return ResponseEntity.ok(count)
    }
}