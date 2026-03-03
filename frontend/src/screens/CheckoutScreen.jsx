import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate('/payment'); 
    };

    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    const gradientButtonStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)',
        border: 'none',
        color: 'white'
    };

    return (
        <div className="container-fluid bg-dark pb-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <style>
                {`
                    .form-control-dark {
                        background-color: #212529;
                        border-color: #495057;
                        color: #fff;
                    }
                    .form-control-dark:focus {
                        background-color: #212529;
                        border-color: #00BCF2;
                        color: #fff;
                        box-shadow: 0 0 0 0.25rem rgba(0, 188, 242, 0.25);
                    }
                    .form-control-dark::placeholder {
                        color: #6c757d;
                    }
                `}
            </style>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card bg-dark text-light border-secondary shadow-lg">
                            <div className="card-body p-4 p-sm-5">
                                <h2 className="text-center mb-4 fw-bold text-uppercase" style={gradientTextStyle}>Shipping Details</h2>
                                <form onSubmit={submitHandler}>
                                    <div className="mb-3">
                                        <label className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            placeholder="Enter your address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            placeholder="Enter city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Postal Code</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            placeholder="Enter postal code"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            placeholder="Enter country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn w-100 fw-bold" style={gradientButtonStyle}>Continue to Payment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutScreen;