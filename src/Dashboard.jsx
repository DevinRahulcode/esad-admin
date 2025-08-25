import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    // --- STATE MANAGEMENT ---
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true); // New state for loading
    const [error, setError] = useState(null);     // New state for errors
    const navigate = useNavigate();

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/employees/getall', {
                    withCredentials: true
                });

                if (Array.isArray(response.data)) {
                    setEmployees(response.data);
                } else {
                    // This case handles unexpected, non-array responses
                    throw new Error("Data received from server was not in the expected format.");
                }
            } catch (err) {
                console.error("There was an error fetching the employee data:", err);
                setError('Failed to load employee data. Please try again later.');

                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    // If unauthorized, redirect to login
                    navigate('/login');
                }
            } finally {
                // This will run after the try or catch block
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]);

    // --- LOGOUT FUNCTIONALITY ---
    const handleLogout = async () => {
        try {
            // Send a POST request to the backend's logout endpoint
            await axios.post('http://localhost:8080/api/auth/logout', {}, {
                withCredentials: true
            });
            // On success, redirect to the login page
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
            // Optionally, show an error message to the user
            alert("Logout failed. Please try again.");
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