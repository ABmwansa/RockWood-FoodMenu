import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null); // Selected food for ordering
  const [quantity, setQuantity] = useState(1); // Order quantity
  const [tableNumber, setTableNumber] = useState(''); // User's table number
  const [orderError, setOrderError] = useState(null); // Store error from order submission

  // Fetch food items from the backend
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/food'); // Adjusted for your API endpoint
        setFoodItems(response.data);
      } catch (err) {
        setError('Failed to fetch food items');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const openModal = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFood(null); // Reset selected food when modal is closed
    setQuantity(1);
    setTableNumber('');
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber || quantity <= 0) {
      setOrderError('Please provide a valid table number and quantity');
      return;
    }

    const orderData = {
      foodId: selectedFood._id,
      quantity,
      totalPrice: selectedFood.price * quantity,
      tableNumber,
    };

    try {
      await axios.post('http://localhost:5000/api/orders', orderData); // Adjust the URL to match your API
      alert('Order placed successfully!');
      closeModal(); // Close modal after successful order
    } catch (err) {
      setOrderError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className={`home-container ${theme}`}>
      <nav className={`top-nav ${theme}`}>
        <h1 className="nav-title">Rockwood Restaurant</h1>
        <div className="nav-buttons">
          <Link to="/admin-login" className="admin-panel-btn">
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
        <i className="search-icon fas fa-search"></i>
      </div>

     <div className="food-cards">
  {loading ? (
    <p>Loading food items...</p>
  ) : error ? (
    <p>{error}</p>
  ) : (
    foodItems.map((food) => (
      <div key={food._id} className="food-card">
        {/* Make sure the imageURL is a proper and accessible URL */}
        {food.imageUrl && (
          <img 
            src={food.imageUrl} 
            alt={food.name} 
            className="food-image" 
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}  // Optional styling for images
          />
        )}
        <h3>{food.name}</h3>
        <p>{food.description}</p>
        <button onClick={() => openModal(food)} className="order-btn">
          Order
        </button>
      </div>
    ))
  )}
</div>

      {showModal && selectedFood && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2 style={{ color: 'blue' }}>Place Your Order</h2>
            {orderError && <p className="error-message">{orderError}</p>}
            <form onSubmit={handleOrderSubmit}>
              <label>Name:</label>
              <input type="text" value={selectedFood.name} readOnly />
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
              <label>Table Number:</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">
                Submit Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
