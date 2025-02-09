const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/terms', (req, res) => {
  // Instead of sending JSON, let Next.js handle the page rendering
  res.sendFile(path.join(__dirname, '../../../src/app/terms/page.jsx'))
})

module.exports = router
