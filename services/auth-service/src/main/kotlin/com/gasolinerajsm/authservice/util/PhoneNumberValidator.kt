package com.gasolinerajsm.authservice.util

object PhoneNumberValidator {
    private val PHONE_NUMBER_REGEX = "^\\+[1-9]\\d{1,14}$".toRegex()

    fun isValidE164(phoneNumber: String): Boolean {
        return phoneNumber.isNotBlank() && phoneNumber.matches(PHONE_NUMBER_REGEX)
    }
}