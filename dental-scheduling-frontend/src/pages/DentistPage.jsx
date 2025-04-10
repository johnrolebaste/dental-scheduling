import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DentistModal from "./DentistModal";
import "../styles/DentistPage.css";

const DentistPage = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDentistId, setEditingDentistId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDentists = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:3000/api/dentist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDentists(response.data);
      } catch (err) {
        setError("Failed to fetch dentists.");
      } finally {
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  const handleDelete = async (dentistId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to perform this action.");
      navigate("/login");
    }

    try {
      await axios.delete(`http://localhost:3000/api/dentist`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { dentistId },
      });
      setDentists(dentists.filter((dentist) => dentist._id !== dentistId));
    } catch (err) {
      setError("Failed to delete dentist.");
    }
  };

  const handleAddDentist = () => {
    setEditingDentistId(null);
    setIsModalOpen(true);
  };

  const handleEditDentist = (dentistId) => {
    setEditingDentistId(dentistId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveDentist = () => {
    setIsModalOpen(false);
    setLoading(true);
    const fetchDentists = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:3000/api/dentist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDentists(response.data);
      } catch (err) {
        setError("Failed to fetch dentists.");
      } finally {
        setLoading(false);
      }
    };
    fetchDentists();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dentist-page">
      <header className="header">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <h1>Dental Office</h1>
        </Link>
        <div className="auth-buttons">
          <button onClick={() => navigate("/")}>Logout</button>
        </div>
      </header>

      <h1>Dentists</h1>

      <div className="add-dentist-button-container">
        <button onClick={handleAddDentist} className="add-dentist-button">
          + Add Dentist
        </button>
      </div>

      {dentists.length === 0 ? (
        <p>No dentists found.</p>
      ) : (
        <table className="dentists-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dentists.map((dentist) => (
              <tr key={dentist._id}>
                <td>{dentist.name}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => handleEditDentist(dentist._id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(dentist._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <DentistModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        dentistId={editingDentistId}
        onSave={handleSaveDentist}
      />
    </div>
  );
};

export default DentistPage;
