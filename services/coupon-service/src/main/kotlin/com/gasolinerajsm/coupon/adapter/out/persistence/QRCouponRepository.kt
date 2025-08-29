package com.gasolinerajsm.coupon.adapter.out.persistence

import com.gasolinerajsm.coupon.domain.CouponStatus
import com.gasolinerajsm.coupon.domain.QRCoupon
import jakarta.persistence.LockModeType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
interface QRCouponRepository : JpaRepository<QRCoupon, UUID> {

    fun findByQrCode(qrCode: String): QRCoupon?

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    fun findAndLockByQrCode(qrCode: String): QRCoupon?

    fun findByToken(token: String): QRCoupon?

    fun findByScannedBy(userId: UUID, pageable: Pageable): Page<QRCoupon>

    fun findByStationId(stationId: UUID): List<QRCoupon>

    fun findByEmployeeId(employeeId: UUID): List<QRCoupon>

    fun findByStatus(status: CouponStatus): List<QRCoupon>

    @Query("SELECT c FROM QRCoupon c WHERE c.scannedBy = :userId AND c.status IN :statuses")
    fun findByUserIdAndStatuses(
        @Param("userId") userId: UUID,
        @Param("statuses") statuses: List<CouponStatus>
    ): List<QRCoupon>

    @Query("SELECT c FROM QRCoupon c WHERE c.expiresAt < :now AND c.status NOT IN ('EXPIRED', 'USED_IN_RAFFLE')")
    fun findExpiredCoupons(@Param("now") now: LocalDateTime): List<QRCoupon>

    @Query("SELECT c FROM QRCoupon c WHERE c.status = 'COMPLETED' AND c.scannedBy IS NOT NULL")
    fun findActiveTicketsForRaffle(): List<QRCoupon>

    @Query("""
        SELECT new map(
            count(c) as totalCoupons,
            coalesce(sum(c.totalTickets), 0) as totalTickets,
            count(case when c.status in ('ACTIVATED', 'COMPLETED') then 1 else null end) as activeCoupons,
            count(case when c.status = 'EXPIRED' then 1 else null end) as expiredCoupons
        )
        FROM QRCoupon c WHERE c.stationId = :stationId
    """)
    fun getStationStats(@Param("stationId") stationId: UUID): Map<String, Any>

    @Query("""
        SELECT new map(
            count(c) as totalCoupons,
            coalesce(sum(c.totalTickets), 0) as totalTickets,
            count(c.scannedBy) as scannedCoupons,
            (cast(count(c.scannedBy) as double) / case when count(c) > 0 then count(c) else 1 end * 100) as conversionRate
        )
        FROM QRCoupon c WHERE c.employeeId = :employeeId
    """)
    fun getEmployeeStats(@Param("employeeId") employeeId: UUID): Map<String, Any>
}