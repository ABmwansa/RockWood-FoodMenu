import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas
import '../style/AdminPanel.css'; // Import the CSS for styling

const AdminPanel = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodImage, setFoodImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFoodList, setShowFoodList] = useState(false);  // Toggle for food list visibility

  const BASE_API_URL = 'http://localhost:5000/food';

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BASE_API_URL);
        setFoods(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setLoading(false);
      }
    };

    fetchFoods();
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
        const response = await axios.post(BASE_API_URL, formData, {
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
      await axios.delete(`${BASE_API_URL}/${foodId}`);
      setFoods(foods.filter(food => food.id !== foodId));
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  const handleUpdateFood = (food) => {
    // Here you would typically populate a form for editing an existing food item.
    // For example, you could use a modal or open a new form with the food's current data.
    console.log('Update food:', food);
  };

  return (
    <div className="admin-panel"> 
      <h1> Manage Food Menu</h1>
      <button to ="/" className='add-btn' style={{margin:'20px'}}>Go to home page</button>

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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" className='add-btn'>Add Food</button>
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
    </div>
  );
};

export default AdminPanel;
