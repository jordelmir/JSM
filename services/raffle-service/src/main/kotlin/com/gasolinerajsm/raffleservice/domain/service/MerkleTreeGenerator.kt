package com.gasolinerajsm.raffleservice.domain.service

import java.security.MessageDigest

object MerkleTreeGenerator {

    fun generateMerkleRoot(leaves: List<String>): String {
        if (leaves.isEmpty()) {
            return ""
        }
        if (leaves.size == 1) {
            return HashingUtil.sha256(leaves[0])
        }

        var currentLevel = leaves.map { HashingUtil.sha256(it) }

        while (currentLevel.size > 1) {
            val nextLevel = mutableListOf<String>()
            for (i in 0 until currentLevel.size step 2) {
                val left = currentLevel[i]
                val right = if (i + 1 < currentLevel.size) currentLevel[i + 1] else left
                nextLevel.add(HashingUtil.sha256(left, right))
            }
            currentLevel = nextLevel
        }
        return currentLevel[0]
    }
}
