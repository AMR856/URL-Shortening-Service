const express = require("express");
const router = express.Router();

const {
  getURL,
  deleteURL,
  updateURL,
  getStats,
  uploadURL,
} = require("../controllers/url.controller");

router.get("/:shortCode", getURL);

router.delete("/:shortCode", deleteURL);

router.put("/:shortCode", updateURL);

router.get("/:shortCode/stats", getStats);

router.post("/", uploadURL);

module.exports = router;
