import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import VerifyPleaseScreen from './screens/VerifyPleaseScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import Contact from './components/Contact';
import CategoryArtworks from './components/CategoryArtworks';
import SingleArtwork from './components/SingleArtwork';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import WishlistScreen from './screens/WishlistScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import SearchResults from './components/SearchResults';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

function App() {
  return (
    <Routes>
      {/* Routes with Navbar */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="category/:categoryId" element={<CategoryArtworks />} />
        <Route path="artwork/:artworkId" element={<SingleArtwork />} />
        <Route path="search/:keyword" element={<SearchResults />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="forgotpassword" element={<ForgotPasswordScreen />} />
        <Route path="resetpassword/:resetToken" element={<ResetPasswordScreen />} />
        <Route path="/verify-please" element={<VerifyPleaseScreen />} />
        <Route path="/verify-email/:token" element={<EmailVerificationScreen />} />
        <Route path="wishlist" element={<PrivateRoute><WishlistScreen /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
        <Route path="cart" element={<PrivateRoute><CartScreen /></PrivateRoute>} />
        <Route path="checkout" element={<PrivateRoute><CheckoutScreen /></PrivateRoute>} />
        <Route path="payment" element={<PrivateRoute><PaymentScreen /></PrivateRoute>} />
        <Route path="placeorder" element={<PrivateRoute><PlaceOrderScreen /></PrivateRoute>} />
        <Route path="order/:orderId" element={<PrivateRoute><OrderDetailsScreen /></PrivateRoute>} />
      </Route>

      {/* Standalone Admin Routes without Navbar */}
      <Route path="/admin/dashboard" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/order/:orderId" element={<PrivateRoute adminOnly={true}><OrderDetailsScreen /></PrivateRoute>} />
    </Routes>
  );
}

export default App;