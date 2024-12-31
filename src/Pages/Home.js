import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css'; // Import your styles

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Rockwood Restaurant</h1>
        <p>Your one-stop destination for all your food ordering needs at the lodge.</p>
        
        <Link to="/admin" className="admin-button">Admin Panel</Link> {/* Admin Button */}
      </header>

      <nav className="nav-links">
        <Link to="/menu" className="nav-link">View Menu</Link>
        <Link to="/qrcode" className="nav-link">QR Code</Link>
      </nav>
    </div>
  );
};

export default Home;
