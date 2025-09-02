package com.gasolinerajsm.raffleservice.domain.service

import java.security.MessageDigest

/**
 * Utility object for performing SHA-256 hashing operations.
 * Provides methods for hashing single strings and combining two hashes.
 */
object HashingUtil {

    /**
     * Computes the SHA-256 hash of a given input string.
     * The input string is encoded using UTF-8.
     * @param input The string to be hashed.
     * @return The SHA-256 hash as a hexadecimal string.
     */
    fun sha256(input: String): String {
        val bytes = input.toByteArray(Charsets.UTF_8)
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(bytes)
        return digest.fold("", { str, it -> str + "%02x".format(it) })
    }

    /**
     * Computes the SHA-256 hash of two combined hash strings.
     * The two input hashes are combined in a consistent order (lexicographically) before hashing.
     * This is typically used in Merkle tree constructions.
     * @param hash1 The first hash string.
     * @param hash2 The second hash string.
     * @return The SHA-256 hash of the combined strings as a hexadecimal string.
     */
    fun sha256(hash1: String, hash2: String): String {
        // Ensure consistent order for hashing pairs
        val combined = if (hash1 < hash2) hash1 + hash2 else hash2 + hash1
        return sha256(combined)
    }
}