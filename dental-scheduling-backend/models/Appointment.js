const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dentistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dentist",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed", "canceled"],
    default: "scheduled",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
