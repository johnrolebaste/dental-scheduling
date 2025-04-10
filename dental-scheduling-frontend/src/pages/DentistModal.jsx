import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DentistModal.css";

const DentistModal = ({ isOpen, onClose, dentistId, onSave }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const dentistData = { name };

    try {
      if (dentistId) {
        await axios.put(
          `http://localhost:3000/api/dentist`,
          { dentistId, name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/dentist", dentistData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving dentist:", err);
      alert("Failed to save dentist.");
    }
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{dentistId ? "Edit Dentist" : "Add Dentist"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default DentistModal;
