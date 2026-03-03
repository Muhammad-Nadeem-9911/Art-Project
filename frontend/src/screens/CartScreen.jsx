import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const CartScreen = () => {
    const { cart, loading, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#121212', paddingTop: '80px' }}>
                <div className="spinner-border" role="status" style={{ color: '#00BCF2' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const checkoutHandler = () => {
        navigate('/checkout');
    };

    // Calculate total price (assuming paintings have a price field, defaulting to 0 if not)
    // Note: You might need to add a price field to your Painting model if it doesn't exist.
    const totalPrice = cart.reduce((acc, item) => acc + (item.quantity * (item.painting.price || 0)), 0);

    return (
        <div className="container-fluid bg-dark pb-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <style>
                {`
                    .gradient-link {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-decoration: none;
                        font-weight: bold;
                    }
                `}
            </style>
            <div className="container">
                <h2 className="mb-5 text-center fw-bold text-uppercase" style={gradientTextStyle}>Shopping Cart</h2>
                
                {cart.length === 0 ? (
                    <div className="text-center text-light">
                        <p className="fs-4">Your cart is empty.</p>
                        <Link to="/" className="gradient-link fs-5">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            {cart.map((item) => (
                                <div key={item.painting._id} className="card bg-dark text-light border-secondary mb-3 shadow-sm">
                                    <div className="row g-0 align-items-center">
                                        <div className="col-md-3">
                                            <img 
                                                src={item.painting.imageUrl || (item.painting.images && item.painting.images[0])} 
                                                className="img-fluid rounded-start" 
                                                alt={item.painting.title}
                                                style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h5 className="card-title text-uppercase mb-1">{item.painting.title}</h5>
                                                        <p className="text-muted small mb-2">{item.painting.category?.title || 'Uncategorized'}</p>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.painting._id)} className="btn btn-link text-danger p-0">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <div className="d-flex align-items-center">
                                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.painting._id, item.quantity - 1)}>-</button>
                                                        <span className="mx-3">{item.quantity}</span>
                                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.painting._id, item.quantity + 1)}>+</button>
                                                    </div>
                                                    {/* Display price if available */}
                                                    {item.painting.price && <span className="fs-5 fw-bold">${item.painting.price * item.quantity}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-lg-4">
                            <div className="card bg-dark text-light border-secondary shadow-lg">
                                <div className="card-body p-4">
                                    <h4 className="card-title mb-4 text-uppercase" style={gradientTextStyle}>Order Summary</h4>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Total Items:</span>
                                        <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                    </div>
                                    <hr className="border-secondary" />
                                    <button onClick={checkoutHandler} className="btn w-100 fw-bold mt-3" style={gradientButtonStyle}>Proceed to Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartScreen;