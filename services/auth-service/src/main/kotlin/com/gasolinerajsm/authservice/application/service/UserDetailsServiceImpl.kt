package com.gasolinerajsm.authservice.application.service

import com.gasolinerajsm.authservice.adapter.out.persistence.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/**
 * Custom implementation of Spring Security's UserDetailsService.
 * Loads user-specific data by username (which is the phone number in this context).
 */
@Service
class UserDetailsServiceImpl(
    private val userRepository: UserRepository
) : UserDetailsService {

    /**
     * Locates the user based on the username (phone number).
     * @param username The phone number of the user.
     * @return A UserDetails object representing the user.
     * @throws UsernameNotFoundException if the user is not found.
     */
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByPhone(username)
            ?: throw UsernameNotFoundException("User with phone number $username not found")

        // For simplicity, assuming no roles/authorities for now.
        // In a real application, you would fetch user roles/authorities from the database.
        return User(
            username = user.phone,
            password = "", // No password needed for JWT authentication
            authorities = emptyList() // No roles/authorities for simplicity
        )
    }
}
