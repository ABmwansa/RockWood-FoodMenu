import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const foodItems = [
    { name: 'Burger', imageUrl: 'burger.jpg', description: 'Delicious beef burger with fresh veggies' },
    { name: 'Pizza', imageUrl: 'pizza.jpg', description: 'Classic Margherita pizza with mozzarella' },
    { name: 'Pasta', imageUrl: 'pasta.jpg', description: 'Creamy Alfredo pasta with chicken' },
  ];

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="home-container">
      <header className="hero">
        <h1>Rockwood Restaurant</h1>
        <p>Your one-stop destination for all your food ordering needs at the lodge.</p>
      </header>

      <nav className="top-nav">
        <Link to="/admin" className="admin-panel-btn">Admin Panel</Link>
      </nav>

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
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Place Your Order</h2>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" required />
              <label>Quantity:</label>
              <input type="number" placeholder="How many?" required />
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      )}

      <nav className="nav-links">
        <Link to="/menu" className="nav-link">View Menu</Link>
        <Link to="/admin" className="nav-link">Admin Panel</Link>
      </nav>
    </div>
  );
};

export default Home;
