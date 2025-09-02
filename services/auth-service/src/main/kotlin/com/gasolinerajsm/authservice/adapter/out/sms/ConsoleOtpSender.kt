package com.gasolinerajsm.authservice.adapter.out.sms

import com.gasolinerajsm.authservice.application.port.out.OtpSender
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

/**
 * A dummy implementation of OtpSender that logs OTPs to the console.
 * This is for development and testing purposes. In production, this would be replaced
 * by a real SMS or email sending service.
 */
@Component
class ConsoleOtpSender : OtpSender {

    private val logger = LoggerFactory.getLogger(ConsoleOtpSender::class.java)

    /**
     * Sends an OTP by logging it to the console.
     * @param recipient The recipient's address (e.g., phone number).
     * @param otp The OTP code to send.
     */
    override fun send(recipient: String, otp: String) {
        logger.info("Sending OTP to {}: {}", recipient, otp)
        // In a real application, integrate with an SMS gateway here
    }
}
