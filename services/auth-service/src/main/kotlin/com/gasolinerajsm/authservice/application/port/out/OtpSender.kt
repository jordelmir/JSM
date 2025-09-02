package com.gasolinerajsm.authservice.application.port.out

/**
 * Port (interface) for sending One-Time Passwords (OTPs).
 * This abstraction allows different OTP sending mechanisms (e.g., SMS, email) to be plugged in.
 */
interface OtpSender {
    /**
     * Sends an OTP to a specified recipient.
     * @param recipient The address of the recipient (e.g., phone number, email address).
     * @param otp The OTP code to send.
     */
    fun send(recipient: String, otp: String)
}
