const Dentist = require("../models/Dentist");
const Appointment = require("../models/Appointment");

exports.createDentist = async (req, res) => {
  const { name, scheduledAppointments } = req.body;
  try {
    const dentist = new Dentist({
      name,
      scheduledAppointments,
    });
    await dentist.save();
    res.status(201).json({ message: "Dentist created successfully", dentist });
  } catch (error) {
    res.status(500).json({ message: "Error creating dentist", error });
  }
};

exports.getDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();

    const dentistsWithAppointments = await Promise.all(
      dentists.map(async (dentist) => {
        const appointments = await Appointment.find({ dentistId: dentist._id });
        return {
          ...dentist.toObject(),
          scheduledAppointments: appointments,
        };
      })
    );

    res.json(dentistsWithAppointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dentists", error });
  }
};

exports.getDentistById = async (req, res) => {
  const { id } = req.params;

  try {
    const dentist = await Dentist.findById(id);

    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    const appointments = await Appointment.find({ dentistId: dentist._id });

    res.json({
      ...dentist.toObject(),
      scheduledAppointments: appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dentist", error });
  }
};

exports.updateDentist = async (req, res) => {
  const { dentistId, name, scheduledAppointments } = req.body;
  try {
    const dentist = await Dentist.findByIdAndUpdate(
      dentistId,
      { name, scheduledAppointments },
      { new: true }
    );
    res.json({ message: "Dentist updated successfully", dentist });
  } catch (error) {
    res.status(500).json({ message: "Error updating dentist", error });
  }
};

exports.deleteDentist = async (req, res) => {
  const { dentistId } = req.body;
  try {
    await Dentist.findByIdAndDelete(dentistId);
    res.json({ message: "Dentist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dentist", error });
  }
};
