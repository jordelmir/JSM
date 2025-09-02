package com.gasolinerajsm.raffleservice.adapter.out.seed

/**
 * Interface for providing a cryptographic seed based on a given block height.
 * This abstraction allows different sources for randomness (e.g., blockchain data) to be used.
 */
interface SeedProvider {
    /**
     * Retrieves a cryptographic seed for a specific blockchain block height.
     * @param blockHeight The height of the blockchain block to use as a reference for the seed.
     * @return A string representing the cryptographic seed.
     */
    fun getSeed(blockHeight: Long): String
}