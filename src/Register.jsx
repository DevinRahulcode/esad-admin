import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

import { auth, db } from './firebaseConfig'; // Adjust path if firebase.js is in a different folder
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        employeeNumber: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // Basic form validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Employee Name is required';
        if (!formData.employeeNumber.trim()) newErrors.employeeNumber = 'Employee Number is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            // Store additional data in Firestore
            await setDoc(doc(db, 'employees', user.uid), {
                name: formData.name,
                employeeNumber: formData.employeeNumber,
                email: formData.email,
                // Add more fields if needed, e.g., createdAt: new Date()
            });

            // On success, redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed:', err);
            let errorMessage = 'Registration failed. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            }
            setSubmitError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    // Navigate to dashboard to view registered employees
    const handleViewEmployees = () => {
        navigate('/dashboard');
    };

    return (


        

        <div className="register-container">
            <div className="register-form-container">
                <div className="form-header">
                    <button
                        onClick={handleViewEmployees}
                        className="view-employees-button"
                    >
                        Return To Employees Table
                    </button>
                    <h2 className="form-title">Register New Employee</h2>
                </div>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Employee Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter employee name"
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="employeeNumber">Employee Number</label>
                        <input
                            type="text"
                            id="employeeNumber"
                            name="employeeNumber"
                            value={formData.employeeNumber}
                            onChange={handleChange}
                            placeholder="Enter employee number"
                            className={errors.employeeNumber ? 'input-error' : ''}
                        />
                        {errors.employeeNumber && <p className="error-message">{errors.employeeNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Employee Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter employee email"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    {submitError && <p className="error-message submit-error">{submitError}</p>}
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Registering...' : 'Register Employee'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;