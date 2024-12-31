import React, { useState } from 'react';
import '../style/AdminPanel.css'

const AdminPanel = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [menu, setMenu] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuItem({ ...menuItem, [name]: value });
  };

  // Add new menu item
  const handleAddItem = () => {
    if (menuItem.name && menuItem.price) {
      setMenu([...menu, menuItem]);
      setMenuItem({
        name: '',
        description: '',
        price: '',
        image: '',
      });
    }
  };

  // Edit a menu item
  const handleEditItem = (index) => {
    setMenuItem(menu[index]);
    setEditIndex(index);
  };

  // Save updated item
  const handleSaveItem = () => {
    const updatedMenu = [...menu];
    updatedMenu[editIndex] = menuItem;
    setMenu(updatedMenu);
    setMenuItem({
      name: '',
      description: '',
      price: '',
      image: '',
    });
    setEditIndex(null);
  };

  // Delete menu item
  const handleDeleteItem = (index) => {
    const updatedMenu = menu.filter((_, i) => i !== index);
    setMenu(updatedMenu);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <div className="menu-form">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={menuItem.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={menuItem.description}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={menuItem.image}
          onChange={handleInputChange}
        />
        {editIndex !== null ? (
          <button onClick={handleSaveItem}>Save Item</button>
        ) : (
          <button onClick={handleAddItem}>Add Item</button>
        )}
      </div>

      <div className="menu-list">
        <h3>Menu Items</h3>
        {menu.length === 0 ? (
          <p>No items in the menu.</p>
        ) : (
          <ul>
            {menu.map((item, index) => (
              <li key={index}>
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <button onClick={() => handleEditItem(index)}>Edit</button>
                <button onClick={() => handleDeleteItem(index)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
