package com.gasolinerajsm.raffleservice.domain.service

import com.gasolinerajsm.raffleservice.adapter.out.seed.HashingUtil // Corrected import path

/**
 * Implements a Merkle Tree data structure.
 * A Merkle tree is a tree in which every leaf node is labelled with the hash of a data block,
 * and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * Merkle trees are used to efficiently verify the integrity and content of large data structures.
 * @property entries The list of leaf entries (data blocks) from which the Merkle tree is built.
 */
class MerkleTree(private val entries: List<String>) {

    /**
     * The Merkle root of the tree. This is the hash of the top-most node.
     */
    lateinit var root: String
        private set

    init {
        require(entries.isNotEmpty()) { "Merkle Tree cannot be built from an empty list of entries." }
        build()
    }

    /**
     * Builds the Merkle tree from the provided list of entries.
     * The process involves repeatedly hashing pairs of nodes until a single root hash is obtained.
     * If the number of nodes in a layer is odd, the last node is duplicated.
     */
    private fun build() {
        var currentLayer = entries.map { HashingUtil.sha256(it) }

        while (currentLayer.size > 1) {
            val nextLayer = mutableListOf<String>()
            var i = 0
            while (i < currentLayer.size) {
                val left = currentLayer[i]
                val right = if (i + 1 < currentLayer.size) currentLayer[i + 1] else left // Duplicate last if odd number
                nextLayer.add(HashingUtil.sha256(left, right))
                i += 2
            }
            currentLayer = nextLayer
        }
        root = currentLayer.first()
    }
}