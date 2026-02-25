import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import CategoryArtworks from './components/CategoryArtworks';
import SingleArtwork from './components/SingleArtwork';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/category/:categoryId" element={<CategoryArtworks />} />
      <Route path="/artwork/:artworkId" element={<SingleArtwork />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={ <PrivateRoute><AdminDashboard /></PrivateRoute> } 
      />
    </Routes>
  );
}

export default App;