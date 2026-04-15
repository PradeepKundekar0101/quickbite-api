import { Router, Response } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
import User from "../models/User";
import ApiConfig from "../models/ApiConfig";

const router = Router();

router.get("/users", auth, adminAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().lean();
    // Returns ALL fields including passwordHash — intentionally dangerous
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch users" });
  }
});

router.put("/users/:id/ban", auth, adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }

    if (!user.accountFlags.includes("banned")) {
      user.accountFlags.push("banned");
    }
    await user.save();

    res.json({ message: "User banned successfully", userId: user._id, accountFlags: user.accountFlags });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to ban user" });
  }
});

router.get("/config", auth, adminAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const configs = await ApiConfig.find().lean();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch config" });
  }
});

export default router;
