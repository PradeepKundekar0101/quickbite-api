import { Router, Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import Product from "../models/Product";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find().lean();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch restaurants" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) {
      res.status(404).json({ error: "not_found", message: "Restaurant not found" });
      return;
    }

    const menuProducts = await Product.find({
      restaurantId: restaurant._id,
      isAvailable: true,
    }).lean();

    res.json({ ...restaurant, menuProducts });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch restaurant" });
  }
});

export default router;
