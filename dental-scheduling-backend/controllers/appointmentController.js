const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  const { userId, dentistId, date } = req.body;
  try {
    const appointment = new Appointment({ userId, dentistId, date });
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.id,
    }).populate("dentistId");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

exports.updateAppointment = async (req, res) => {
  const { appointmentId, status, date } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status, date },
      { new: true }
    );
    res.json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  try {
    await Appointment.findByIdAndDelete(appointmentId);
    res.json({ message: "Appointment canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment", error });
  }
};
