import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // reuse your existing CSS

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/attendance/all');
        setAttendanceRecords(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch attendance data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAttendance();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="status-message">Loading attendance records...</p>;
    if (error) return <p className="status-message error">{error}</p>;
    if (attendanceRecords.length === 0) return <p className="status-message">No records found.</p>;

    return (
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th></th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Type</th>
    
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{record.employeeName}</td>
                <td>{record.type}</td>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
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
            <li><a href="/dashboard" className="nav-item">Dashboard</a></li>
            <li><a href="/register" className="nav-item">Register Employee</a></li>
            <li><a href="/attendance" className="nav-item active">Attendance</a></li>
            <li><a href="/leave-request" className="nav-item">Leave Request</a></li>
            <li><a href="/payslip" className="nav-item">Payslips</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2 className="header-title">Attendance Records</h2>
        </header>

        <div className="content-area">
          <h3 className="content-title">All Attendance</h3>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Attendance;
