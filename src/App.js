import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';      // Make sure this import is correct
import Dashboard from './Dashboard';
import Register from "./Register";
import Attendance from './Attendance';

import LeaveRequest from './LeaveRequest';
import Payslip from './Payslip';
import TotalCount from './TotalCount';

function App() {
    return (

        <BrowserRouter>
            <Routes>
                {/* This tells React to redirect the base URL ("/") to "/login" */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* This tells React to show your Login component at the "/login" URL */}
                <Route path="/login" element={<Login />} />

                {/* This tells React to show the Dashboard at the "/dashboard" URL */}
                <Route path="/total-count" element={<TotalCount />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/payslip" element={<Payslip/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;