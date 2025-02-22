const express = require('express')
const router = express.Router()
const { exploreFirestore } = require('../utils/firestoreExplorer')

router.get('/firestore-structure', async (req, res) => {
  try {
    const structure = await exploreFirestore()
    res.json(structure)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
