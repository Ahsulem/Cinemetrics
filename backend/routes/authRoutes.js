import express from "express";
import { signup, login, fetchUser, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/fetch-user", fetchUser);
router.post("/logout", logout);

// Protected routes
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;