import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/employees/getall",
          { withCredentials: true }
        );

        if (Array.isArray(response.data)) setEmployees(response.data);
        else throw new Error("Unexpected data format.");
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data.");
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios({
        method: "post",
        url: "http://localhost:8080/api/auth/logout",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  const renderContent = () => {
    if (loading) return <p className="status-message">Loading employees...</p>;
    if (error) return <p className="status-message error">{error}</p>;
    if (employees.length === 0) return <p className="status-message">No employees found.</p>;

    return (
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>NIC</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.nic}</td>
                <td>{emp.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/total-count" className="logo">🧩 HR Management</Link>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Employees</NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Register Employee</NavLink>
            </li>
            <li>
              <NavLink to="/attendance" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Attendance</NavLink>
            </li>
            <li>
              <NavLink to="/leave-request" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Leave Request</NavLink>
            </li>
            <li>
              <NavLink to="/payslip" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Payslips</NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2 className="header-title">Welcome to HR Management</h2>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </header>

        <div className="content-area">
          <h3 className="content-title">Employee Overview</h3>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
