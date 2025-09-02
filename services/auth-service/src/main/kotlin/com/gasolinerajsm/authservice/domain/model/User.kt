package com.gasolinerajsm.authservice.domain.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

/**
 * Represents a User entity in the authentication service.
 * This is a JPA entity mapped to the "users" table.
 * @property id The unique identifier of the user. Auto-generated.
 * @property phone The phone number of the user, which is unique and not null.
 * @property email The email address of the user. Unique and not null.
 * @property passwordHash The hashed password of the user. Not null.
 * @property createdAt The timestamp when the user record was created. Automatically set on creation.
 * @property updatedAt The timestamp when the user record was last updated. Automatically updated on pre-update events.
 */
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "phone", unique = true, nullable = false)
    val phone: String,

    @Column(name = "email", unique = true, nullable = false)
    val email: String,

    @Column(name = "password_hash", nullable = false)
    val passwordHash: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
) {
    /**
     * Lifecycle callback method executed before an entity update.
     * Automatically updates the `updatedAt` timestamp.
     */
    @PreUpdate
    fun preUpdate() {
        updatedAt = Instant.now()
    }
}