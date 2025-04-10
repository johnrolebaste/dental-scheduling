const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Appointment = require("../models/Appointment");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res
      .status(201)
      .json({ message: "User  registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const usersWithAppointments = await Promise.all(
      users.map(async (user) => {
        const appointments = await Appointment.find({ userId: user._id });
        return {
          ...user.toObject(),
          appointments,
        };
      })
    );

    res.json(usersWithAppointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.updateUser = async (req, res) => {
  const { userId, name, email, password, role } = req.body;
  try {
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }
    if (role) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role value" });
      }
      updatedFields.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User  not found" });
    }

    res.json({ message: "User  updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};
