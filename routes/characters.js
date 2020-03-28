const express = require('express');

const router = express.Router();

router.get('/:name', (req, res) => {
  res.send(`character ${req.params.name} home page`);
});

module.exports = router;
