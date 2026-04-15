import { Router, Response } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
import Order from "../models/Order";

const router = Router();

router.get("/revenue", auth, adminAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ status: { $ne: "cancelled" } }).lean();

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalMargin = orders.reduce((sum, o) => sum + o.internalMargin, 0);
    const totalSupplierCost = orders.reduce((sum, o) => sum + o.supplierCost, 0);
    const totalDeliveryPayout = orders.reduce((sum, o) => sum + o.deliveryPartnerPayout, 0);
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalMargin: Math.round(totalMargin * 100) / 100,
      totalSupplierCost: Math.round(totalSupplierCost * 100) / 100,
      totalDeliveryPayout: Math.round(totalDeliveryPayout * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      orderCount: orders.length,
      marginPercentage:
        totalRevenue > 0
          ? Math.round((totalMargin / totalRevenue) * 10000) / 100
          : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch revenue analytics" });
  }
});

router.get("/delivery-partners", auth, adminAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ status: "delivered" }).lean();

    const totalPayouts = orders.reduce((sum, o) => sum + o.deliveryPartnerPayout, 0);
    const avgPayout = orders.length ? totalPayouts / orders.length : 0;

    res.json({
      totalDeliveries: orders.length,
      totalPayouts: Math.round(totalPayouts * 100) / 100,
      avgPayoutPerDelivery: Math.round(avgPayout * 100) / 100,
      deliveries: orders.map((o) => ({
        orderId: o._id,
        payout: o.deliveryPartnerPayout,
        restaurantName: o.restaurantName,
        deliveryAddress: o.deliveryAddress,
        deliveredAt: o.createdAt,
      })),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "server_error", message: "Failed to fetch delivery partner analytics" });
  }
});

export default router;
