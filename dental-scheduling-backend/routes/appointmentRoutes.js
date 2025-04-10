const express = require("express");
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/appointments", authMiddleware, getAppointments);
router.post("/appointments", authMiddleware, createAppointment);
router.put("/appointments", authMiddleware, updateAppointment);
router.delete("/appointments", authMiddleware, cancelAppointment);

module.exports = router;
