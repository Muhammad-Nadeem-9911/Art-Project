import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const { shippingAddress, savePaymentMethod } = useContext(CartContext);

    // If shipping address is not set, redirect to shipping screen
    if (!shippingAddress.address) {
        navigate('/checkout');
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal'); // Default payment method

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder'); // Next step
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
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card bg-dark text-light border-secondary shadow-lg">
                            <div className="card-body p-4 p-sm-5">
                                <h2 className="text-center mb-4 fw-bold text-uppercase" style={gradientTextStyle}>Payment Method</h2>
                                <form onSubmit={submitHandler}>
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="cod"
                                            value="Cash on Delivery"
                                            checked={paymentMethod === 'Cash on Delivery'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="cod">
                                            Cash on Delivery
                                        </label>
                                    </div>
                                    {/* You can add more payment methods here like Stripe */}
                                    {/* <div className="form-check mb-4">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="stripe"
                                            value="Stripe"
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="stripe">
                                            Stripe
                                        </label>
                                    </div> */}
                                    <button type="submit" className="btn w-100 fw-bold mt-3" style={gradientButtonStyle}>Continue</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentScreen;