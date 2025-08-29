package com.gasolinerajsm.coupon.application.service

import com.google.zxing.BarcodeFormat
import com.google.zxing.client.j2se.MatrixToImageWriter
import com.google.zxing.common.BitMatrix
import com.google.zxing.qrcode.QRCodeWriter
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.util.*
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import com.gasolinerajsm.coupon.config.QrSecurityProperties // Import QrSecurityProperties

@Service
class QRCodeGenerator(
    private val qrSecurityProperties: QrSecurityProperties // Inject QrSecurityProperties
) {

    fun generateQRCode(token: String): String {
        // Crear payload con timestamp y firma para seguridad
        val timestamp = System.currentTimeMillis()
        val payload = "$token:$timestamp"
        val signature = generateSignature(payload)

        return "$payload:$signature"
    }

    fun generateQRImage(qrCode: String, size: Int = 300): ByteArray {
        val qrCodeWriter = QRCodeWriter()
        val bitMatrix: BitMatrix = qrCodeWriter.encode(qrCode, BarcodeFormat.QR_CODE, size, size)

        val outputStream = ByteArrayOutputStream()
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream)

        return outputStream.toByteArray()
    }

    fun validateQRCode(qrCode: String): Boolean {
        return try {
            val parts = qrCode.split(":")
            if (parts.size != 3) return false

            val token = parts[0]
            val timestamp = parts[1].toLong()
            val signature = parts[2]

            // Verificar que no haya expirado (24 horas)
            val now = System.currentTimeMillis()
            if (now - timestamp > 24 * 60 * 60 * 1000) return false

            // Verificar firma
            val expectedSignature = generateSignature("$token:$timestamp")
            signature == expectedSignature
        } catch (e: Exception) {
            false
        }
    }

    private fun generateSignature(payload: String): String {
        val mac = Mac.getInstance("HmacSHA256")
        val secretKey = SecretKeySpec(qrSecurityProperties.signatureSecret.toByteArray(), "HmacSHA256") // Use property
        mac.init(secretKey)

        val hash = mac.doFinal(payload.toByteArray())
        return Base64.getEncoder().encodeToString(hash)
    }
}
