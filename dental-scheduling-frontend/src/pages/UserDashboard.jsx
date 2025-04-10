import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/appointments",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAppointments(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("No token found. Please log in.");
        navigate("/login");
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.delete(`http://localhost:3000/api/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { appointmentId },
        });

        setAppointments(
          appointments.filter((appt) => appt._id !== appointmentId)
        );
      } catch (err) {
        setError(err.message);
        navigate("/login");
      }
    }
  };

  const handleReschedule = async (appointmentId, dentistId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/dentist/${dentistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const appointments = response.data.scheduledAppointments || [];
      const dates = appointments
        .filter((appointment) => appointment.status === "scheduled")
        .map((appointment) => new Date(appointment.date).toDateString());

      setBookedDates(dates);
      setReschedulingId(appointmentId);
    } catch (err) {
      setError("Failed to fetch dentist's booked dates.");
    }
  };

  const confirmReschedule = async (appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3000/api/appointments`,
        {
          appointmentId: appointmentId,
          status: "scheduled",
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReschedulingId(null);
      setSelectedDate(null);
      window.location.reload();
    } catch (err) {
      setError("Rescheduling failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-content">
      <header className="header">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <h1>Dental Office</h1>
        </Link>
        <div className="auth-buttons">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <h1>Your Appointments</h1>

      <div
        style={{
          marginTop: "15px",
          marginBottom: "15px",
          textAlign: "right",
          marginRight: "40%",
          marginLeft: "40%",
        }}
      >
        <button
          className="add-appointment-button"
          onClick={() => navigate("/booking")}
        >
          + Add
        </button>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Dentist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.dentistId.name}</td>
                <td>
                  <div className="button-group">
                    <button
                      onClick={() =>
                        handleReschedule(
                          appointment._id,
                          appointment.dentistId._id
                        )
                      }
                    >
                      Reschedule
                    </button>
                    <button onClick={() => handleCancel(appointment._id)}>
                      Cancel
                    </button>
                  </div>

                  {reschedulingId === appointment._id && (
                    <div className="datepicker-popup">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        excludeDates={bookedDates.map((d) => new Date(d))}
                        minDate={new Date()}
                        placeholderText="Select a new date"
                      />
                      <button
                        onClick={() => confirmReschedule(appointment._id)}
                        disabled={!selectedDate}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setReschedulingId(null);
                          setSelectedDate(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;
