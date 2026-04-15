import { Router, Response } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

// Intentionally returns ALL fields including sensitive ones (passwordHash, internalCreditScore, etc.)
// Scalable's AI should detect and flag these for stripping
router.get("/me", auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).lean();
    if (!user) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      internalCreditScore: user.internalCreditScore,
      accountFlags: user.accountFlags,
      lastLoginIp: user.lastLoginIp,
      addresses: user.addresses,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch profile" });
  }
});

router.put("/me", auth, async (req: AuthRequest, res: Response) => {
  try {
    const allowedFields = ["name", "phone", "addresses"];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true }).lean();
    if (!user) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      internalCreditScore: user.internalCreditScore,
      accountFlags: user.accountFlags,
      lastLoginIp: user.lastLoginIp,
      addresses: user.addresses,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to update profile" });
  }
});

export default router;
