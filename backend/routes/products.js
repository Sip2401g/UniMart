const express = require("express");
const router = express.Router();
const axios = require("axios");
const Product = require("../models/Product");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://localhost:8000";

const proxyAIRequest = async (path, body) => {
  try {
    const { data } = await axios.post(`${AI_SERVICE}${path}`, body, {
      timeout: 20000,
    });
    return { ok: true, data };
  } catch (err) {
    const status = err.response?.status || 503;
    const detail = err.response?.data?.error || err.response?.data?.message || err.code || "Unknown error";

    if (err.code === "ECONNREFUSED") {
      return {
        ok: false,
        status: 503,
        error: "AI service is offline. Start the AI service on port 8000 and try again.",
        detail: "Connection refused to AI service",
      };
    }

    return {
      ok: false,
      status,
      error: "AI request failed",
      detail,
    };
  }
};

// GET /api/products  — public, with search & filter
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, condition } = req.query;
    const query = { isSold: false };

    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("seller", "name college phone email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/my
router.get("/my", protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller", "name college phone email"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products
router.post("/", protect, upload.array("images", 4), async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;
    const images = req.files?.map((f) => f.filename) || [];

    const product = await Product.create({
      title, description, price, category, condition, images,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/products/:id/sold
router.patch("/:id/sold", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your listing" });

    product.isSold = true;
    await product.save();
    res.json({ message: "Marked as sold", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your listing" });

    await product.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── AI ROUTES ──────────────────────────────────────────────────

// POST /api/products/ai/generate-listing
router.post("/ai/generate-listing", protect, async (req, res) => {
  const result = await proxyAIRequest("/ai/generate-listing", req.body);
  if (!result.ok) {
    return res.status(result.status).json({ message: result.error, error: result.detail });
  }
  res.json(result.data);
});

// POST /api/products/ai/suggest-price
router.post("/ai/suggest-price", protect, async (req, res) => {
  const result = await proxyAIRequest("/ai/suggest-price", req.body);
  if (!result.ok) {
    return res.status(result.status).json({ message: result.error, error: result.detail });
  }
  res.json(result.data);
});

// POST /api/products/ai/chat
router.post("/ai/chat", async (req, res) => {
  const result = await proxyAIRequest("/ai/chat", req.body);
  if (!result.ok) {
    return res.status(result.status).json({ message: result.error, error: result.detail });
  }
  res.json(result.data);
});

module.exports = router;