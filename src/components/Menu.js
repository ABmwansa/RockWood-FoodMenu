import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get('/api/menu')
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      <h1>Menu</h1>
      <div>
        {menuItems.map(item => (
          <div key={item._id} style={{ marginBottom: '20px' }}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <button>Add to Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
