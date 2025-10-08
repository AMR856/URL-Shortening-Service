const express = require("express");
const router = express.Router();

const {
  getURL,
  deleteURL,
  updateURL,
  getStats,
  uploadURL,
} = require("../controllers/url.controller");

/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: Endpoints for managing shortened URLs
 */


/**
 * @swagger
 * /shorten/{shortCode}:
 *   get:
 *     summary: Fetch a shortened URL
 *     description: Retrieves the original long URL and increments the click count.
 *     security:
 *       - bearerAuth: []
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The short code of the URL to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the original URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clt123xyz"
 *                 url:
 *                   type: string
 *                   example: "https://example.com/very/long/link"
 *                 shortCode:
 *                   type: string
 *                   example: "abc123"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-08T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-08T14:22:00Z"
 *                 clicks:
 *                   type: integer
 *                   example: 17
 *       400:
 *         description: Invalid or missing short code.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/:shortCode", getURL);


/**
 * @swagger
 * /shorten/{shortCode}:
 *   delete:
 *     summary: Delete a shortened URL
 *     description: Permanently removes a short link from the system.
 *     security:
 *       - bearerAuth: []
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The short code of the URL.
 *     responses:
 *       204:
 *         description: Successfully deleted.
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Internal server error
 */


router.delete("/:shortCode", deleteURL);

/**
 * @swagger
 * /shorten/{shortCode}:
 *   put:
 *     summary: Update a shortened URL
 *     description: Update the long/original URL associated with a given short code.
 *     security:
 *       - bearerAuth: []
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The short code of the URL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://new-destination.com"
 *     responses:
 *       200:
 *         description: Successfully updated the URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 url:
 *                   type: string
 *                   example: "https://new-destination.com"
 *                 shortCode:
 *                   type: string
 *                   example: "abc123"
 *                 createdAt:
 *                   type: string
 *                   example: "2025-10-08T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2025-10-08T13:00:00Z"
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Internal server error.
 */

router.put("/:shortCode", updateURL);

/**
 * @swagger
 * /shorten/{shortCode}/stats:
 *   get:
 *     summary: Get statistics for a shortened URL
 *     description: Returns stats such as number of clicks, creation date, and expiration.
 *     security:
 *       - bearerAuth: []
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The short code of the URL.
 *     responses:
 *       200:
 *         description: Successfully retrieved stats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 url:
 *                   type: string
 *                   example: "https://example.com"
 *                 shortCode:
 *                   type: string
 *                   example: "abc123"
 *                 clicks:
 *                   type: integer
 *                   example: 42
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-08T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-08T12:10:00Z"
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Internal server error.
 */


router.get("/:shortCode/stats", getStats);

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Create a shortened URL
 *     description: Accepts a long URL and returns a shortened version.
 *     security:
 *       - bearerAuth: []
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/very/long/link"
 *     responses:
 *       201:
 *         description: Successfully created a shortened URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 url:
 *                   type: string
 *                   example: "https://example.com/very/long/link"
 *                 shortCode:
 *                   type: string
 *                   example: "abc123"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-08T14:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-08T14:00:00Z"
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */

router.post("/", uploadURL);

module.exports = router;
