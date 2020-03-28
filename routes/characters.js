const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/:name', (req, res) => {
  const path = `./localDb/chars/${req.params.name}.json`;
  try {
    // eslint-disable-next-line no-console
    console.log(fs.existsSync(path), path);
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path);
      res.status(200).json(JSON.parse(data));
    } else {
      res.status(404).json({ error: `there is no character named ${req.params.name}` });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
