import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { cart, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [placingOrder, setPlacingOrder] = useState(false);

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cart.reduce((acc, item) => acc + (item.painting.price || 0) * item.quantity, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // Free shipping over $100
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% tax
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/checkout');
        }
        if (!paymentMethod) {
            navigate('/payment');
        }
    }, [paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        setPlacingOrder(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    orderItems: cart.map(item => ({
                        name: item.painting.title,
                        qty: item.quantity,
                        image: item.painting.imageUrl || (item.painting.images && item.painting.images[0]),
                        price: item.painting.price || 0,
                        painting: item.painting._id
                    })),
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                }),
            });

            if (response.ok) {
                const order = await response.json();
                clearCart();
                navigate(`/order/${order._id}`);
            } else {
                alert('Failed to place order');
            }
        } catch (error) {
            console.error(error);
            alert('Error placing order');
        } finally {
            setPlacingOrder(false);
        }
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
                <div className="row">
                    <div className="col-md-8">
                        <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-3" style={gradientTextStyle}>Shipping</h4>
                                <p>
                                    <strong>Address: </strong>
                                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                                </p>
                            </div>
                        </div>

                        <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-3" style={gradientTextStyle}>Payment Method</h4>
                                <p>
                                    <strong>Method: </strong>
                                    {paymentMethod}
                                </p>
                            </div>
                        </div>

                        <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-3" style={gradientTextStyle}>Order Items</h4>
                                {cart.length === 0 ? (
                                    <p>Your cart is empty</p>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {cart.map((item, index) => (
                                            <li key={index} className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <img src={item.painting.imageUrl} alt={item.painting.title} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px' }} />
                                                    <Link to={`/artwork/${item.painting._id}`} className="text-decoration-none text-light">{item.painting.title}</Link>
                                                </div>
                                                <span>{item.quantity} x ${item.painting.price} = ${(item.quantity * item.painting.price).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-dark text-light border-secondary shadow-lg">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-4" style={gradientTextStyle}>Order Summary</h4>
                                <div className="d-flex justify-content-between mb-2"><span>Items</span><span>${itemsPrice}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span>Shipping</span><span>${shippingPrice}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span>Tax</span><span>${taxPrice}</span></div>
                                <hr className="border-secondary" />
                                <div className="d-flex justify-content-between mb-4 fs-5 fw-bold"><span>Total</span><span>${totalPrice}</span></div>
                                <button type="button" className="btn w-100 fw-bold" style={gradientButtonStyle} onClick={placeOrderHandler} disabled={placingOrder}>
                                    {placingOrder ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;