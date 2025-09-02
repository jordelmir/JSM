package com.gasolinerajsm.coupon.outbox

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

/**
 * Represents an Outbox message entity for implementing the Outbox Pattern.
 * This entity stores events that need to be reliably published to other services
 * or message brokers, ensuring atomicity with the local transaction.
 * @property id The unique identifier of the outbox message. Auto-generated UUID.
 * @property aggregateType The type of the aggregate root that generated the event (e.g., "coupon").
 * @property aggregateId The unique identifier of the aggregate root.
 * @property eventType The type of the event (e.g., "CouponActivatedEvent").
 * @property payload The JSON string representation of the event payload.
 * @property createdAt The timestamp when the outbox message was created.
 */
@Entity
@Table(name = "outbox")
data class Outbox(
    @Id
    val id: UUID = UUID.randomUUID(),
    val aggregateType: String,
    val aggregateId: String,
    val eventType: String,
    val payload: String,
    val createdAt: Instant = Instant.now()
)
