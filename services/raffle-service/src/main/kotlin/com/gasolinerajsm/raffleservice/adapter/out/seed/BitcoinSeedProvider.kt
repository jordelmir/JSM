package com.gasolinerajsm.raffleservice.adapter.out.seed

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.client.ResourceAccessException
import org.springframework.web.client.getForObject

/**
 * Provides a cryptographic seed by fetching a Bitcoin block hash from blockchain.info.
 * This implementation uses a RestTemplate to make HTTP requests.
 */
@Component
class BitcoinSeedProvider(
    private val restTemplate: RestTemplate, // Assuming RestTemplate is configured as a Bean
    @Value("\${bitcoin.api.url:https://blockchain.info/block-height/{blockHeight}?format=json}") // Configurable URL
    private val bitcoinApiUrl: String
) : SeedProvider {

    private val logger = LoggerFactory.getLogger(BitcoinSeedProvider::class.java)

    /**
     * Retrieves a cryptographic seed for a specific blockchain block height.
     * The seed is the hash of the Bitcoin block at the given height.
     * @param blockHeight The height of the Bitcoin block to use as a reference for the seed.
     * @return A string representing the cryptographic seed (Bitcoin block hash).
     * @throws RuntimeException if there is an error fetching the block data or parsing the response.
     */
    override fun getSeed(blockHeight: Long): String {
        val url = bitcoinApiUrl.replace("{blockHeight}", blockHeight.toString())
        logger.info("Fetching Bitcoin block data from: {}", url)

        try {
            val response = restTemplate.getForObject<BitcoinBlockResponse>(url)
            if (response.blocks.isNotEmpty()) {
                val hash = response.blocks.first().hash
                logger.info("Successfully fetched block hash for height {}: {}", blockHeight, hash)
                return hash
            } else {
                logger.warn("No blocks found in response for height: {}", blockHeight)
                throw RuntimeException("No blocks found for block height: $blockHeight")
            }
        } catch (e: HttpClientErrorException) {
            logger.error("Client error fetching Bitcoin block for height {}: {} - {}", blockHeight, e.statusCode, e.responseBodyAsString)
            throw RuntimeException("Client error fetching Bitcoin block: ${e.statusCode}", e)
        } catch (e: HttpServerErrorException) {
            logger.error("Server error fetching Bitcoin block for height {}: {} - {}", blockHeight, e.statusCode, e.responseBodyAsString)
            throw RuntimeException("Server error fetching Bitcoin block: ${e.statusCode}", e)
        } catch (e: ResourceAccessException) {
            logger.error("Network error fetching Bitcoin block for height {}: {}", blockHeight, e.message)
            throw RuntimeException("Network error fetching Bitcoin block", e)
        } catch (e: Exception) {
            logger.error("Unexpected error fetching Bitcoin block for height {}: {}", blockHeight, e.message, e)
            throw RuntimeException("Unexpected error fetching Bitcoin block", e)
        }
    }
}

/**
 * Data class representing the response structure for Bitcoin block data from blockchain.info.
 * @property blocks A list of BlockInfo objects.
 */
data class BitcoinBlockResponse(
    val blocks: List<BlockInfo>
)

/**
 * Data class representing information about a Bitcoin block.
 * @property hash The hash of the Bitcoin block.
 */
data class BlockInfo(
    val hash: String
)