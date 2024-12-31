import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas
import '../style/AdminPanel.css'; // Import the CSS for styling

// Temporary data for food items (this would be managed via API calls in a real application)
const initialFoods = [
  { id: 1, name: 'Pizza', description: 'Delicious cheesy pizza with toppings', price: 12.99, imageUrl: 'pizza.jpg' },
  { id: 2, name: 'Burger', description: 'Juicy burger with fresh ingredients', price: 8.99, imageUrl: 'burger.jpg' },
];

const AdminPanel = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const [foods, setFoods] = useState(initialFoods); // State for storing food items
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodImage, setFoodImage] = useState('');

  // Toggle the visibility of the QR code
  const toggleQRVisibility = () => setQrVisible(!qrVisible);

  // Handle form submission to add a new food item
  const handleAddFood = (e) => {
    e.preventDefault();
    if (foodName && foodDescription && foodPrice) {
      const newFood = {
        id: foods.length + 1,
        name: foodName,
        description: foodDescription,
        price: parseFloat(foodPrice),
        imageUrl: foodImage, // You can adjust the image URL as per requirement
      };
      setFoods([...foods, newFood]);
      setFoodName('');
      setFoodDescription('');
      setFoodPrice('');
      setFoodImage('');
    }
  };

  // Handle deleting a food item
  const handleDeleteFood = (id) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  // Handle editing a food item
  const handleEditFood = (id) => {
    const foodToEdit = foods.find((food) => food.id === id);
    setFoodName(foodToEdit.name);
    setFoodDescription(foodToEdit.description);
    setFoodPrice(foodToEdit.price);
    setFoodImage(foodToEdit.imageUrl);

    handleDeleteFood(id); // Delete the current item before updating
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Manage Food Menu</h1>

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

      {/* Food Form Section */}
      <form onSubmit={handleAddFood} className="food-form">
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
          type="text"
          placeholder="Food Image URL"
          value={foodImage}
          onChange={(e) => setFoodImage(e.target.value)}
        />
        <button type="submit">Add Food</button>
      </form>

      {/* Display Food List */}
      <div className="food-list">
        <h2>Food Menu</h2>
        <ul>
          {foods.map((food) => (
            <li key={food.id} className="food-item">
              <img src={food.imageUrl} alt={food.name} width="100" height="100" />
              <div>
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p>Price: ${food.price}</p>
              </div>
              <button onClick={() => handleEditFood(food.id)}>Edit</button>
              <button onClick={() => handleDeleteFood(food.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
