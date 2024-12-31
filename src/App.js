import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Menu from './components/Menu';
import AdminPanel from './components/AdminPanel';
import QRCode from './components/QRCode';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/qrcode" element={<QRCode />} />
      </Routes>
    </Router>
  );
};

export default App;
