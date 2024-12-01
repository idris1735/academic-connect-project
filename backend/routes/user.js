const express = require('express');
const router = express.Router();

router.get('/api/custom-route', (req, res) => {
  res.json({ message: 'This is a custom route' });
});

// router.get('/fee')
module.exports = router;

