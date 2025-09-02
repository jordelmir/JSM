package com.gasolinerajsm.coupon.domain

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.*

/**
 * Represents an ad view event within the coupon service.
 * This entity tracks details of a user's interaction with an advertisement,
 * including its association with a coupon and earned tickets.
 * @property id The unique identifier of the ad view. Auto-generated UUID.
 * @property couponId The ID of the coupon associated with this ad view.
 * @property userId The ID of the user who viewed the ad.
 * @property adId The identifier of the advertisement viewed.
 * @property duration The duration of the ad view in seconds.
 * @property sequence The sequence number of the ad within a series (e.g., 1st ad, 2nd ad).
 * @property ticketsEarned The number of tickets earned by viewing this ad.
 * @property status The current status of the ad view (e.g., STARTED, COMPLETED).
 * @property completedAt The timestamp when the ad view was completed, if applicable.
 * @property createdAt The timestamp when this ad view record was created.
 */
@Entity
@Table(name = "ad_views")
@EntityListeners(AuditingEntityListener::class)
data class AdView(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID, // Removed UUID.randomUUID()

    @Column(nullable = false)
    val couponId: UUID,

    @Column(nullable = false)
    val userId: UUID,

    @Column(nullable = false)
    val adId: String,

    @Column(nullable = false)
    val duration: Int, // Duración en segundos

    @Column(nullable = false)
    val sequence: Int, // Secuencia del anuncio (1, 2, 3...)

    @Column(nullable = false)
    val ticketsEarned: Int, // Tickets ganados por este anuncio

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: AdViewStatus = AdViewStatus.STARTED,

    @Column
    val completedAt: LocalDateTime? = null,

    @CreatedDate
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)

/**
 * Represents the possible statuses of an ad view.
 */
enum class AdViewStatus {
    STARTED,    // Anuncio iniciado
    COMPLETED,  // Anuncio completado
    SKIPPED,    // Anuncio saltado
    FAILED      // Error en reproducción
}