import { Router, Response } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import Order from "../models/Order";
import Product from "../models/Product";
import Restaurant from "../models/Restaurant";

const router = Router();

router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .lean();

    // Intentionally includes internalMargin, supplierCost, deliveryPartnerPayout
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch orders" });
  }
});

router.get("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    }).lean();

    if (!order) {
      res.status(404).json({ error: "not_found", message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch order" });
  }
});

router.post("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;

    if (!restaurantId || !items || !items.length || !deliveryAddress) {
      res.status(400).json({
        error: "validation_error",
        message: "restaurantId, items, and deliveryAddress are required",
      });
      return;
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ error: "not_found", message: "Restaurant not found" });
      return;
    }

    let total = 0;
    let supplierCost = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const qty = item.quantity || 1;
      total += product.price * qty;
      supplierCost += product.costPrice * qty;

      orderItems.push({
        productId: product._id.toString(),
        name: product.name,
        quantity: qty,
        price: product.price,
      });
    }

    const deliveryFee = 30;
    total += deliveryFee;

    const internalMargin = total - supplierCost - deliveryFee * 0.6;
    const deliveryPartnerPayout = deliveryFee * 0.7;

    const order = await Order.create({
      userId: req.user!.id,
      restaurantId,
      restaurantName: restaurant.name,
      items: orderItems,
      total,
      internalMargin: Math.round(internalMargin * 100) / 100,
      supplierCost: Math.round(supplierCost * 100) / 100,
      deliveryPartnerPayout,
      deliveryFee,
      status: "placed",
      deliveryAddress,
      estimatedDelivery: new Date(Date.now() + 40 * 60 * 1000),
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to create order" });
  }
});

router.put("/:id/cancel", auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!order) {
      res.status(404).json({ error: "not_found", message: "Order not found" });
      return;
    }

    if (order.status !== "placed") {
      res.status(400).json({
        error: "invalid_state",
        message: "Only orders with status 'placed' can be cancelled",
      });
      return;
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to cancel order" });
  }
});

export default router;
