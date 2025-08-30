import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    // --- STATE MANAGEMENT ---
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/employees/getall', {
                    withCredentials: true,
                });

                if (Array.isArray(response.data)) {
                    setEmployees(response.data);
                } else {
                    throw new Error('Data received from server was not in the expected format.');
                }
            } catch (err) {
                console.error('There was an error fetching the employee data:', err);
                setError('Failed to load employee data. Please try again later.');

                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]);

    // --- LOGOUT FUNCTIONALITY ---
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout', {}, {
                withCredentials: true,
            });
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
            alert('Logout failed. Please try again.');
        }
    };

    // --- CONDITIONAL RENDERING LOGIC ---
    const renderContent = () => {
        if (loading) {
            return <p className="status-message">Loading employees...</p>;
        }

        if (error) {
            return <p className="status-message error">{error}</p>;
        }

        if (employees.length === 0) {
            return <p className="status-message">No new employees found.</p>;
        }

        return (
            <div className="table-container">
                <table className="employee-table">
                    <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>NIC</th>
                        <th>Gender</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.nic}</td>
                            <td>{employee.gender}</td>
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
                <div className="logo">HR Management</div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/Register"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                Register Employee
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/attendance"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                Attendance
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/leave-request"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                Leave Request
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <h2 className="header-title">Welcome to HR Management System</h2>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </header>
                <div className="content-area">
                    <h3 className="content-title">New Employees</h3>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;