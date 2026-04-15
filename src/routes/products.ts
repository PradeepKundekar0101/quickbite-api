import { Router, Request, Response } from "express";
import Product from "../models/Product";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isAvailable: true }).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch products" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      res.status(400).json({ error: "validation_error", message: "Query parameter 'q' is required" });
      return;
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
      isAvailable: true,
    }).lean();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Search failed" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch product" });
  }
});

export default router;
