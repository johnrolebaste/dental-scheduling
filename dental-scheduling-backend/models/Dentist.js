const mongoose = require("mongoose");

const dentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scheduledAppointments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  ],
});

module.exports = mongoose.model("Dentist", dentistSchema);
