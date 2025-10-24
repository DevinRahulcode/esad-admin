import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TotalCount.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

function TotalCount() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    attendance: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/dashboard/summary");
        setCounts({
          totalEmployees: res.data.totalEmployees || 0,
          pendingLeaves: res.data.pendingLeaves || 0,
          approvedLeaves: res.data.approvedLeaves || 0,
          rejectedLeaves: res.data.rejectedLeaves || 0,
          attendance: res.data.todayAttendance || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    { title: "Total Employees", value: counts.totalEmployees, color: "#60a5fa" },
    { title: "Pending Leave Requests", value: counts.pendingLeaves, color: "#fbbf24" },
    { title: "Approved Leave Requests", value: counts.approvedLeaves, color: "#34d399" },
    { title: "Rejected Leave Requests", value: counts.rejectedLeaves, color: "#f87171" },
    { title: "Attendance (Today)", value: counts.attendance, color: "#a78bfa" },
  ];

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/total-count" className="logo">
          🧩 HR Management
        </Link>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Employees
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Register Employee
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Attendance
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leave-request"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Leave Request
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/payslip"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
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
          <h2 className="header-title">Welcome to HR Management</h2>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>

        {/* Dashboard Summary Cards */}
        <div className="totalcount-container">
          {cards.map((card, idx) => (
            <div key={idx} className="count-card" style={{ borderTopColor: card.color }}>
              <h3 className="count-title">{card.title}</h3>
              <p className="count-value" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TotalCount;
