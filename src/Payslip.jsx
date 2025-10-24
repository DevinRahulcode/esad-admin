import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Payslip.css";

function Payslip() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/employees/fetchall")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleUpload = () => {
    if (!selectedEmployee || !file) {
      setMessage("Please select an employee and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `http://localhost:4000/api/payslips/upload/${selectedEmployee}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(() => setMessage("Payslip uploaded successfully!"))
      .catch(() => setMessage("Error uploading payslip."));
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">🧩 HR Management</div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Register"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                Register Employee
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                Attendance
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leave-request"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                Leave Request
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/payslip"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                Payslips
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2 className="header-title">Upload Payslip</h2>
        </header>

        <div className="content-area">
          {message && (
            <div className={`status-message ${message.includes("Error") ? "error" : ""}`}>
              {message}
            </div>
          )}

          <div className="payslip-form">
            <label>Select Employee:</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <label>Select Payslip File:</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button className="approve-btn" onClick={handleUpload}>
              Upload Payslip
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Payslip;
