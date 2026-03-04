import React, { useMemo, useState } from "react";
import "../style/AdminLoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// -------------------------------------------
// MOCK SETTINGS
// -------------------------------------------
const USE_MOCK_AUTH = true; // <-- set to false to use backend APIs
const MOCK_DELAY_MS = 600;

// In a real app, NEVER store passwords like this.
// This is purely for mock/demo purposes.
const DEFAULT_MOCK_USERS = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@rockwood.com",
    password: "Admin@123",
    role: "admin",
    approved: true,
  },
  {
    id: 2,
    name: "Manager",
    email: "manager@rockwood.com",
    password: "Manager@123",
    role: "manager",
    approved: true,
  },
  {
    id: 3,
    name: "Staff (Pending Approval)",
    email: "pending@rockwood.com",
    password: "Pending@123",
    role: "staff",
    approved: false,
  },
];

const LS_USERS_KEY = "mockAdminUsers";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const loadMockUsers = () => {
  const raw = localStorage.getItem(LS_USERS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
  return DEFAULT_MOCK_USERS;
};

const saveMockUsers = (users) => {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
};

const createMockToken = (email) => {
  // simple mock token
  return `mock-token.${btoa(email)}.${Date.now()}`;
};

const AdminLoginPage = () => {
  const [activeSection, setActiveSection] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const mockUsers = useMemo(() => (USE_MOCK_AUTH ? loadMockUsers() : []), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // -------------------------------------------
    // MOCK LOGIN
    // -------------------------------------------
    if (USE_MOCK_AUTH) {
      await sleep(MOCK_DELAY_MS);

      const users = loadMockUsers(); // fresh read
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!found || found.password !== password) {
        setMessage("Invalid email or password.");
        return;
      }

      if (!found.approved) {
        setMessage("Your account is pending admin approval.");
        return;
      }

      const token = createMockToken(found.email);
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(found)); // optional
      navigate("/admin");
      return;
    }

    // -------------------------------------------
    // REAL LOGIN (BACKEND)
    // -------------------------------------------
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid email or password.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");

    // -------------------------------------------
    // MOCK SIGNUP
    // -------------------------------------------
    if (USE_MOCK_AUTH) {
      await sleep(MOCK_DELAY_MS);

      const users = loadMockUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (exists) {
        setMessage("An account with that email already exists.");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "staff",
        approved: false, // pending approval
      };

      const next = [newUser, ...users];
      saveMockUsers(next);

      setMessage("Account created! Waiting for admin approval.");
      setActiveSection("login");
      setPassword("");
      return;
    }

    // -------------------------------------------
    // REAL SIGNUP (BACKEND)
    // -------------------------------------------
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setMessage("Account created! Waiting for admin approval.");
        setActiveSection("login");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating account.");
    }
  };

  // Optional helper to show mock credentials quickly in the UI
  const fillMock = (which) => {
    const users = loadMockUsers();
    const u = users.find((x) => x.email === which);
    if (!u) return;
    setEmail(u.email);
    setPassword(u.password);
    setName(u.name);
    setMessage("");
    setActiveSection("login");
  };

  return (
    <div className="admin-login-container">
      <header className="admin-login-header">
        <h1>Admin Access</h1>
        <p>Welcome to the Rockwood Restaurant Admin Panel</p>

        {USE_MOCK_AUTH && (
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
            <div><strong>Mock mode ON</strong> (no backend calls)</div>
            <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="submit-button"
                onClick={() => fillMock("admin@rockwood.com")}
                style={{ padding: "8px 10px" }}
              >
                Use Admin Login
              </button>
              <button
                type="button"
                className="submit-button"
                onClick={() => fillMock("manager@rockwood.com")}
                style={{ padding: "8px 10px" }}
              >
                Use Manager Login
              </button>
              <button
                type="button"
                className="submit-button"
                onClick={() => fillMock("pending@rockwood.com")}
                style={{ padding: "8px 10px" }}
              >
                Use Pending Login
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="auth-toggle-buttons">
        <button
          className={`auth-toggle-button ${activeSection === "login" ? "active" : ""}`}
          onClick={() => setActiveSection("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={`auth-toggle-button ${activeSection === "signup" ? "active" : ""}`}
          onClick={() => setActiveSection("signup")}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <div className="auth-section">
        {message && <div className="auth-message">{message}</div>}

        {activeSection === "login" && (
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
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        )}

        {activeSection === "signup" && (
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
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
