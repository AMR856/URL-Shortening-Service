const express = require("express");
const router = express.Router();

const {
  getURL,
  deleteURL,
  updateURL,
  getStats,
  uploadURL,
} = require("../controllers/url.controller");

router.get("/:shortUrl", getURL);

router.delete("/:shortUrl", deleteURL);

router.put("/:shortUrl", updateURL);

router.get("/:shortUrl/stats", getStats);

router.post("/", uploadURL);

module.exports = router;
