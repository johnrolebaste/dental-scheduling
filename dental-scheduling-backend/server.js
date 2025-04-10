const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dentistRoutes = require("./routes/dentistRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes, appointmentRoutes, dentistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
