import React, { useState } from 'react';
import '../style/AdminLoginPage.css'; // Create this CSS file for styles
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLoginPage = () => {
  const [activeSection, setActiveSection] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin'); // Redirect to admin dashboard
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Invalid email or password.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/signup', { name, email, password });
      if (response.status === 201) {
        setMessage('Account created! Waiting for admin approval.');
        setActiveSection('login'); // Switch to login section
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error creating account.');
    }
  };

  return (
    <div className="admin-login-container">
      <header className="admin-login-header">
        <h1>Admin Access</h1>
        <p>Welcome to the Rockwood Restaurant Admin Panel</p>
      </header>

      <div className="auth-toggle-buttons">
        <button
          className={`auth-toggle-button ${activeSection === 'login' ? 'active' : ''}`}
          onClick={() => setActiveSection('login')}
        >
          Login
        </button>
        <button
          className={`auth-toggle-button ${activeSection === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveSection('signup')}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-section">
        {message && <div className="auth-message">{message}</div>}

        {activeSection === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">Login</button>
          </form>
        )}

        {activeSection === 'signup' && (
          <form className="auth-form" onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <label>Full Name:</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
