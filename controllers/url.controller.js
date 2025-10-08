const { generateShortCode } = require("../utils/utils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getURL = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode || typeof shortCode !== "string") {
      return res.status(400).json({ message: "You must provide a short code." });
    }

    const urlRecord = await prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!urlRecord) {
      return res.status(404).json({ message: "Short URL not found." });
    }

    const updatedRecord = await prisma.urls.update({
      where: { shortCode },
      data: {
        clicks: { increment: 1 },
      },
    });

    res.status(200).json({
      id: updatedRecord.id,
      url: updatedRecord.url,
      shortCode: updatedRecord.shortCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteURL = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode || typeof shortCode !== "string") {
      return res.status(400).json({ msg: "You should provide a short code" });
    }

    const url = await prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    await prisma.urls.delete({
      where: { shortCode },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateURL = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const newUrl = req.body.url;
    if (!newUrl || typeof newUrl !== "string") {
      return res
        .status(400)
        .json({ message: "The original URL should be provided" });
    }
    try {
      new URL(newUrl);
    } catch {
      return res.status(400).json({
        error: "Invalid new URL format.",
      });
    }
    if (!shortCode || typeof shortCode !== "string") {
      return res
        .status(400)
        .json({ message: "You should the current short URL" });
    }

    const updated = await prisma.urls.update({
      where: { shortCode },
      data: { url: newUrl, updatedAt: new Date() },
    });

    res.status(200).json({
      id: updated.id,
      url: updated.url,
      shortCode: updated.shortCode,
    });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "short URL wasn't found" });
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode || typeof shortCode !== "string") {
      return res.status(400).json({ message: "You should provide a URL" });
    }

    const urlRecord = await prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!urlRecord) {
      return res.status(404).json({ message: "URL wasn't found" });
    }

    res.status(200).json({
      id: urlRecord.id,
      url: urlRecord.url,
      shortCode: urlRecord.shortCode,
      createdAt: urlRecord.createdAt,
      updatedAt: urlRecord.updatedAt,
      clicks: urlRecord.clicks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadURL = async (req, res) => {
  try {
    const url = req.body.url;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "You should provide a URL" });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: "Invalid URL format.",
      });
    }

    const shortCode = generateShortCode();
    const newUrl = await prisma.urls.create({
      data: {
        url,
        shortCode,
      },
    });

    res.status(201).json({
      id: newUrl.id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getURL,
  deleteURL,
  updateURL,
  getStats,
  uploadURL,
};
