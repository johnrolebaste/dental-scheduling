import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import { jwtDecode } from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/BookingPage.css";

const Booking = () => {
  const [dentist, setDentist] = useState("");
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [dentists, setDentists] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDentists = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.id);

          const response = await axios.get(`${API_URL}/dentist`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDentists(response.data);
        } catch (error) {
          setError("Failed to decode token or fetch dentists");
          console.error("Error:", error);
        }
      } else {
        setError("No token found. Please log in.");
        navigate("/register");
      }
    };

    fetchDentists();
  }, []);

  const handleDentistChange = (e) => {
    const selectedDentistId = e.target.value;
    setDentist(selectedDentistId);

    const selectedDentist = dentists.find(
      (doc) => doc.name === selectedDentistId
    );
    if (selectedDentist) {
      const appointments = selectedDentist.scheduledAppointments || [];
      const dates = appointments
        .filter((appointment) => appointment.status === "scheduled")
        .map(
          (appointment) =>
            new Date(appointment.date).toISOString().split("T")[0]
        );
      setBookedDates(dates);
    } else {
      setBookedDates([]);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!dentist || !date) {
      setError("Please select a dentist and a date.");
      return;
    }

    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0);
    const selectedDate = adjustedDate.toISOString().split("T")[0];

    if (bookedDates.includes(selectedDate)) {
      setError("Selected date is already booked. Please choose another date.");
      return;
    }

    const token = localStorage.getItem("token");
    const selectedDentist = dentists.find((doc) => doc.name === dentist);
    const dentistId = selectedDentist ? selectedDentist._id : null;

    if (!dentistId) {
      setError("Invalid dentist selected.");
      return;
    }

    const bookingData = {
      userId: userId,
      dentistId: dentistId,
      date: selectedDate,
    };

    try {
      const response = await axios.post(
        `${API_URL}/appointments`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Booking confirmed with ${dentist} on ${selectedDate}`);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to book appointment. Please try again.");
      console.error("Error booking appointment:", error);
    }
  };

  const isDateBooked = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return bookedDates.includes(formattedDate);
  };

  return (
    <div className="booking-container">
      <header className="header">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <h1>Dental Office</h1>
        </Link>
      </header>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleBooking}>
        <label htmlFor="dentist">Select Dentist:</label>
        <select
          id="dentist"
          value={dentist}
          onChange={handleDentistChange}
          required
        >
          <option value="">--Select a Dentist--</option>
          {dentists.map((doc) => (
            <option key={doc._id} value={doc.name}>
              {doc.name}
            </option>
          ))}
        </select>

        <label htmlFor="date">Select Date:</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          filterDate={(date) => !isDateBooked(date)}
          minDate={new Date()}
          placeholderText="Select a date"
          required
          disabled={!dentist}
        />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default Booking;
