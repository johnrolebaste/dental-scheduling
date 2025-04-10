const express = require("express");
const {
  createDentist,
  getDentists,
  updateDentist,
  deleteDentist,
  getDentistById,
} = require("../controllers/dentistController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/dentist", authMiddleware, createDentist);
router.get("/dentist", authMiddleware, getDentists);
router.put("/dentist", authMiddleware, updateDentist);
router.delete("/dentist", authMiddleware, deleteDentist);
router.get("/dentist/:id", authMiddleware, getDentistById);

module.exports = router;
