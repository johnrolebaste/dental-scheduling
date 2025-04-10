import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import BookingPage from "./pages/BookingPage";
import UserDashboard from "./pages/UserDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DentistPage from "./pages/DentistPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dentist" element={<DentistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
