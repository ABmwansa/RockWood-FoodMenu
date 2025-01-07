import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import '../style/AdminPanel.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminPanel = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [qrVisible, setQrVisible] = useState(false);
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodImage, setFoodImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFoodList, setShowFoodList] = useState(false);
  const [showManageAccounts, setShowManageAccounts] = useState(false);
  const [unapprovedAccounts, setUnapprovedAccounts] = useState([]);

  const BASE_API_URL = 'http://localhost:5000';

  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_API_URL}/food`);
        setFoods(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching foods:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Fetch unapproved accounts
  useEffect(() => {
    const fetchUnapprovedAccounts = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/pending-accounts`);
        setUnapprovedAccounts(response.data);
      } catch (error) {
        console.error('Error fetching unapproved accounts:', error.response?.data || error.message);
      }
    };
    fetchUnapprovedAccounts();
  }, []);

  const toggleQRVisibility = () => setQrVisible(!qrVisible);

  const handleAddFood = async (e) => {
    e.preventDefault();

    if (foodName && foodDescription && foodPrice && foodImage) {
      const formData = new FormData();
      formData.append('name', foodName);
      formData.append('description', foodDescription);
      formData.append('price', foodPrice);
      formData.append('image', foodImage);

      try {
        const response = await axios.post(`${BASE_API_URL}/food`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFoods((prevFoods) => [...prevFoods, response.data]);
        setFoodName('');
        setFoodDescription('');
        setFoodPrice('');
        setFoodImage(null);
      } catch (error) {
        console.error('Error adding food:', error.response?.data || error.message);
      }
    }
  };

  const handleFileChange = (e) => {
    setFoodImage(e.target.files[0]);
  };
  const handleBackToHome = () => {
    navigate('/'); // Navigate to home route
  };

  const handleDeleteFood = async (foodId) => {
    try {
      await axios.delete(`${BASE_API_URL}/food/${foodId}`);
      setFoods((prevFoods) => prevFoods.filter((food) => food._id !== foodId));
    } catch (error) {
      console.error('Error deleting food:', error.response?.data || error.message);
    }
  };

  const handleApproveAccount = async (account) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/approve-account/${account._id}`, {
        role: 'approved',
      });
      console.log(response.data.message);
      setUnapprovedAccounts((prevAccounts) =>
        prevAccounts.filter((item) => item._id !== account._id)
      );
    } catch (error) {
      console.error('Error approving account:', error.response?.data || error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Manage Food Menu</h1>
        {/* Back-to-Home Button */}
        <button onClick={handleBackToHome} className="back-home-btn">
        Back to Home
      </button>

      {/* QR Code Section */}
      <button className="generate-qrcode-btn" onClick={toggleQRVisibility}>
        {qrVisible ? 'Hide QR Code' : 'Generate QR Code'}
      </button>

      {qrVisible && (
        <div className="qrcode-container">
          <QRCodeCanvas value="https://rockwoodmenu.vercel.app" size={256} />
          <button onClick={() => window.print()}>Print QR Code</button>
        </div>
      )}

      {/* Manage Accounts */}
      <button
        onClick={() => setShowManageAccounts(!showManageAccounts)}
        className="manage-accounts-btn"
      >
        {showManageAccounts ? 'Hide Manage Accounts' : 'Manage Accounts'}
      </button>

      {showManageAccounts && (
        <div className="manage-accounts">
          <h2>Unapproved Accounts</h2>
          {unapprovedAccounts.length === 0 ? (
            <p>No accounts pending approval.</p>
          ) : (
            <ul>
              {unapprovedAccounts.map((account) => (
                <li key={account._id}>
                  <span>
                    {account.name} ({account.email})
                  </span>
                  <button
                    onClick={() => handleApproveAccount(account)}
                    className="approve-account-btn"
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Food Form */}
      <form onSubmit={handleAddFood} className="food-form" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Food Description"
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Food Price"
          value={foodPrice}
          onChange={(e) => setFoodPrice(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" className="add-btn">
          Add Food
        </button>
      </form>

      {/* Food List */}
      <button
        onClick={() => setShowFoodList(!showFoodList)}
        className="toggle-food-list-btn"
      >
        {showFoodList ? 'Hide Available Food' : 'Show Available Food'}
      </button>

      {showFoodList && (
        <div className="food-list">
          {loading ? (
            <p>Loading food menu...</p>
          ) : (
            <div className="food-grid">
              {foods.map((food) => (
                <div key={food._id} className="food-item">
                  <img
                    src={food.imageUrl || '/default-food-image.png'}
                    alt={food.name}
                    className="food-image"
                  />
                  <div className="food-info">
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>
                    <p>Price: K{food.price}</p>
                  </div>
                  <div className="food-actions">
                    <button className="update-btn">Update</button>
                    <button
                      onClick={() => handleDeleteFood(food._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
