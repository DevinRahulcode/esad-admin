import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; // reuse your existing CSS

function LeaveRequest() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8080/leave/all");
        setLeaves(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const updateStatus = async (leaveId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/leave/updateStatus/${leaveId}?status=${status}`
      );
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveId
            ? { ...leave, status: status.toUpperCase() }
            : leave
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating leave status");
    }
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading leave requests...</span>
        </div>
      );
    if (error) return <p className="error-message">{error}</p>;
    if (leaves.length === 0)
      return <p className="empty-text">No leave requests found.</p>;

    return (
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Leave Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employeeId}</td>
                <td>{leave.employeeName}</td>
                <td>{leave.leaveDate}</td>
                <td>{leave.reason}</td>
                <td className={`status ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </td>
                <td>
                  {leave.status === "PENDING" ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => updateStatus(leave.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => updateStatus(leave.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>
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
        <div className="logo">🧩 HR Management</div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="/dashboard" className="nav-item">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/register" className="nav-item">
                Register Employee
              </a>
            </li>
            <li>
              <a href="/attendance" className="nav-item">
                Attendance
              </a>
            </li>

            <li>
              <a href="/leave-request" className="nav-item active">
                Leave Request
              </a>
            </li>

            <li>
              <a href="/payslip" className="nav-item">
                Payslips
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2 className="header-title">Leave Requests</h2>
        </header>

        <div className="content-area">
          <h3 className="content-title">All Leave Requests</h3>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default LeaveRequest;
