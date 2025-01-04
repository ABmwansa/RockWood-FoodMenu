import React, { useState } from 'react';
import '../style/AdminLoginPage.css'; // Create this CSS file for styles
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import axios from 'axios'; // For making HTTP requests

const AdminLoginPage = () => {
  const [activeSection, setActiveSection] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Set up navigate for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response.data.token) {
        // Store the token in localStorage (or in a state management library like Redux)
        localStorage.setItem('adminToken', response.data.token);

        // Redirect to the AdminPanel after successful login
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Add sign-up logic here
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Admin Access</h1>
        <p>Welcome to the Rockwood Restaurant Admin Panel</p>
      </header>

      <div className="auth-buttons">
        <button
          className={`auth-button ${activeSection === 'login' ? 'active' : ''}`}
          onClick={() => setActiveSection('login')}
        >
          Login
        </button>
        <button
          className={`auth-button ${activeSection === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveSection('signup')}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-section">
        {activeSection === 'login' && (
          <div className="login-section">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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

              <button type="submit" className="submit-btn">Login</button>
            </form>
          </div>
        )}

        {activeSection === 'signup' && (
          <div className="signup-section">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
              <label>Full Name:</label>
              <input type="text" placeholder="Enter your full name" required />

              <label>Email:</label>
              <input type="email" placeholder="Enter your email" required />

              <label>Password:</label>
              <input type="password" placeholder="Create a password" required />

              <button type="submit" className="submit-btn">Sign Up</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
