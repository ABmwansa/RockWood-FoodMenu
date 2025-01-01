import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('dark');

  const foodItems = [
    { name: 'Burger', imageUrl: 'burger.jpg', description: 'Delicious beef burger with fresh veggies' },
    { name: 'Pizza', imageUrl: 'pizza.jpg', description: 'Classic Margherita pizza with mozzarella' },
    { name: 'Pasta', imageUrl: 'pasta.jpg', description: 'Creamy Alfredo pasta with chicken' },
  ];

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className={`home-container ${theme}`}>
      <nav className={`top-nav ${theme}`}>
        <h1>Rockwood Restaurant</h1>
        <div className="nav-buttons">
          
          <Link to="/admin" className="admin-panel-btn">
            Admin Panel
          </Link>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </nav>

      <header className="hero">
        <h1>Welcome to Rockwood</h1>
        <p>Your one-stop destination for all your food ordering needs at the lodge.</p>
      </header>

      <div className="search-bar">
        <input type="text" placeholder="Search for food..." />
      </div>

      <div className="food-cards">
        {foodItems.map((food, index) => (
          <div key={index} className="food-card">
            <img src={food.imageUrl} alt={food.name} className="food-image" />
            <h3>{food.name}</h3>
            <p>{food.description}</p>
            <button onClick={openModal} className="order-btn">
              Order
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Place Your Order</h2>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" required />
              <label>Quantity:</label>
              <input type="number" placeholder="How many?" required />
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
