import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Homepage.css";

const Homepage = () => {
  const isLoggedIn = localStorage.getItem("token") != null;
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      navigate("/register");
    } else {
      navigate("/booking");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1>Dental Office</h1>
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <button className="login-button">Login</button>
              </Link>
              <Link to="/register">
                <button className="register-button">Register</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <button className="dashboard-button">Dashboard</button>
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>
      <main className="main-content">
        <h2>Welcome to Our Dental Office</h2>
        <p>
          <span onClick={handleBookingClick} className="booking-link">
            Book your appointment today!
          </span>
        </p>
      </main>
    </div>
  );
};

export default Homepage;
