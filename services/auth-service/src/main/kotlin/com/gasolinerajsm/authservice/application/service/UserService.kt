package com.gasolinerajsm.authservice.application.service

import com.gasolinerajsm.authservice.model.User
import com.gasolinerajsm.authservice.adapter.out.persistence.UserRepository // Corrected import
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

/**
 * Service responsible for managing user-related operations.
 * This includes finding users by email and creating new users.
 */
@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    /**
     * Finds a user by their email address.
     * @param email The email address of the user to find.
     * @return The User entity if found.
     * @throws UsernameNotFoundException if no user with the given email is found.
     */
    fun findByEmail(email: String): User {
        return userRepository.findByEmail(email)
            ?: throw UsernameNotFoundException("User with email $email not found")
    }

    /**
     * Creates a new user with a hashed password.
     * @param user The User object containing user details (excluding password, or with a placeholder password).
     * @param plainTextPassword The plain-text password to be hashed and stored.
     * @return The created User entity with the password hashed.
     */
    fun createUser(user: User, plainTextPassword: String): User {
        val hashedPassword = passwordEncoder.encode(plainTextPassword)
        val userWithHashedPassword = user.copy(passwordHash = hashedPassword)
        return userRepository.save(userWithHashedPassword)
    }

    /**
     * Finds an existing user by phone number or creates a new one if not found.
     * This method is used during OTP verification flow.
     * @param phone The phone number of the user.
     * @return The found or newly created User entity.
     */
    fun findOrCreateUser(phone: String): User {
        return userRepository.findByPhone(phone) ?: run {
            // Create a dummy user for now, as email and password are not part of OTP flow
            // In a real application, this would involve a proper registration process
            val newUser = User(phone = phone, email = "$phone@example.com", passwordHash = "") // passwordHash will be set by createUser
            createUser(newUser, "default_password") // Call the refactored createUser
        }
    }
}