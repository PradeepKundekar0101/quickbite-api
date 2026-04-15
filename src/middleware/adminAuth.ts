import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const adminAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "forbidden", message: "Admin access required" });
    return;
  }
  next();
};

export default adminAuth;
