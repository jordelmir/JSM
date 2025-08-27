package com.gasolinerajsm.authservice.service

import com.gasolinerajsm.authservice.model.User
import com.gasolinerajsm.authservice.repository.UserRepository
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun findByEmail(email: String): User {
        return userRepository.findByEmail(email)
            ?: throw UsernameNotFoundException("User with email $email not found")
    }

    fun createUser(user: User): User {
        val hashedPassword = passwordEncoder.encode(user.passwordHash)
        val userWithHashedPassword = user.copy(passwordHash = hashedPassword)
        return userRepository.save(userWithHashedPassword)
    }
}
