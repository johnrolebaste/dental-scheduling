const express = require("express");
const {
  register,
  login,
  getAllUsers,
  updateUser,
} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware,  getAllUsers);
router.post("/users", authMiddleware, updateUser);

module.exports = router;
