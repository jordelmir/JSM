package com.gasolinerajsm.authservice.adapter.out.persistence

import com.gasolinerajsm.authservice.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


/**
 * Repository interface for managing User entities.
 * Extends JpaRepository to provide standard CRUD operations.
 */
@Repository
interface UserRepository : JpaRepository<User, Long> {
    /**
     * Finds a User entity by their phone number.
     * @param phone The phone number of the user to find.
     * @return The User entity if found, or null otherwise.
     */
    fun findByPhone(phone: String): User?

    /**
     * Finds a User entity by their email address.
     * @param email The email address of the user to find.
     * @return The User entity if found, or null otherwise.
     */
    fun findByEmail(email: String): User?
}
