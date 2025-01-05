import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import '../style/AdminPanel.css';

const AdminPanel = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodImage, setFoodImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFoodList, setShowFoodList] = useState(false);
  const [showManageAccounts, setShowManageAccounts] = useState(false); // Toggle for Manage Accounts section
  const [pendingAccounts, setPendingAccounts] = useState([]); // State for pending accounts

  const BASE_API_URL = 'http://localhost:5000';

  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_API_URL}/food`);
        setFoods(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Fetch pending accounts
  useEffect(() => {
    const fetchPendingAccounts = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/pending-accounts`);
        setPendingAccounts(response.data);
      } catch (error) {
        console.error('Error fetching pending accounts:', error);
      }
    };
    fetchPendingAccounts();
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
        setFoods([...foods, response.data]);
        setFoodName('');
        setFoodDescription('');
        setFoodPrice('');
        setFoodImage(null);
      } catch (error) {
        console.error('Error adding food:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    setFoodImage(e.target.files[0]);
  };

  const handleDeleteFood = async (foodId) => {
    try {
      await axios.delete(`${BASE_API_URL}/food/${foodId}`);
      setFoods(foods.filter((food) => food.id !== foodId));
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  const handleUpdateFood = (food) => {
    console.log('Update food:', food);
  };

  const handleApproveAccount = async (accountId) => {
    try {
      await axios.put(`${BASE_API_URL}/approve-account/${accountId}`);
      setPendingAccounts(pendingAccounts.filter((account) => account.id !== accountId));
    } catch (error) {
      console.error('Error approving account:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Manage Food Menu</h1>
      <button to="/" className="add-btn" style={{ margin: '20px' }}>
        Go to home page
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
       <button onClick={() => setShowManageAccounts(!showManageAccounts)} className="manage-accounts-btn">
        {showManageAccounts ? 'Hide Orders' : 'View Orders'}
      </button>
      <button onClick={() => setShowManageAccounts(!showManageAccounts)} className="manage-accounts-btn">
        {showManageAccounts ? 'Hide Manage Accounts' : 'Manage Accounts'}
      </button>
     
      {showManageAccounts && (
        <div className="manage-accounts">
          <h2>Pending Accounts</h2>
          {pendingAccounts.length === 0 && <p>No pending accounts to approve.</p>}
          {pendingAccounts.length > 0 && (
            <ul>
              {pendingAccounts.map((account) => (
                <li key={account.id}>
                  <span>{account.name} - {account.email}</span>
                  <button onClick={() => handleApproveAccount(account.id)} className="approve-account-btn">
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Food Form */}
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
        <button type="submit" className="add-btn">Add Food</button>
      </form>

      {/* Toggle Food List Visibility */}
      <button onClick={() => setShowFoodList(!showFoodList)} className="toggle-food-list-btn">
        {showFoodList ? 'Hide Available Food' : 'Show Available Food'}
      </button>

      {/* Display Food List */}
      {showFoodList && (
        <div className="food-list">
          {loading && <p>Loading food menu...</p>}
          <div className="food-grid">
            {foods.map((food) => (
              <div key={food.id} className="food-item">
                <img src={food.imageUrl} alt={food.name} className="food-image" />
                <div className="food-info">
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>Price: K{food.price}</p>
                </div>
                <div className="food-actions">
                  <button onClick={() => handleUpdateFood(food)} className="update-btn">Update</button>
                  <button onClick={() => handleDeleteFood(food.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Accounts Section */}
      
     
    </div>
  );
};

export default AdminPanel;
