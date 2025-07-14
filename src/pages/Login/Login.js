import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://fitness-tracker-api-enez.onrender.com/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is not OK
      if (!response.ok) {
        const errorData = await response.json();  // Parse the response as JSON
        throw new Error(errorData.message || 'Login failed'); // Get message from JSON
      }

      const data = await response.json();  // Parse the successful response as JSON
      localStorage.setItem('token', data.access);  // Store the JWT token

      // Show success SweetAlert when login is successful
      Swal.fire({
        title: 'Success!',
        text: 'You have logged in successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF69B4', // Pink color for button
      }).then(() => {
        // Redirect after login
        window.location.href = '/';
      });
    } catch (err) {
      setError(err.message);

      // Show error message with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Login failed',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF69B4', // Pink color for button
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="login-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="username"
            className="login-input"
          />
        </div>
        <div className="login-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete="current-password"
            className="login-input"
          />
        </div>
        <button type="submit" className="login-btn">Sign In</button>
      </form>
    </div>
  );
}
