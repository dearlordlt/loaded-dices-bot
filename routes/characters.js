const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/:name', (req, res) => {
  const path = `./localDb/chars/${req.params.name}.json`;
  try {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path);
      res.status(200).json(JSON.parse(data));
    }
  } catch (err) {
    res.status(200).json(err);
  }
});

module.exports = router;
