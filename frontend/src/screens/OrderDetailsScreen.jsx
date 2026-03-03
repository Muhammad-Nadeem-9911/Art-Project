import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Toast from '../components/Toast';

const OrderItem = ({ item, order, user, showToast }) => {
    const [review, setReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);

    const fetchPaintingDetails = async () => {
            try {
                const res = await fetch(`/api/paintings/${item.painting}`);
                if (res.ok) {
                    const data = await res.json();
                    // Find review by this user
                    const userReview = data.reviews.find(r => r.user === order.user._id && r.order === order._id);
                    setReview(userReview);
                }
            } catch (err) {
                console.error(err);
            }
        };

    useEffect(() => {
        fetchPaintingDetails();
    }, [item.painting, order._id]);

    const submitReview = async () => {
        setSubmittingReview(true);
        try {
            const res = await fetch(`/api/paintings/${item.painting}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ rating, comment, orderId: order._id }),
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Review submitted successfully');
                setShowReviewModal(false);
                fetchPaintingDetails(); // Refresh to show the new review
            } else {
                showToast(data.message || 'Error submitting review', 'error');
            }
        } catch (err) {
            showToast('Error connecting to server', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    const submitReply = async () => {
        setSubmittingReply(true);
        try {
            const res = await fetch(`/api/paintings/${item.painting}/${review._id}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ text: replyText }),
            });
            if (res.ok) {
                showToast('Reply submitted');
                setShowReplyForm(false);
                fetchPaintingDetails();
            } else {
                showToast('Error submitting reply', 'error');
            }
        } catch (err) {
            showToast('Error connecting to server', 'error');
        } finally {
            setSubmittingReply(false);
        }
    };

    return (
        <li className="list-group-item bg-dark text-light border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px' }} />
                    <div>
                        <Link to={`/artwork/${item.painting}`} className="text-decoration-none text-light d-block">{item.name}</Link>
                        <small className="text-muted">{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</small>
                    </div>
                </div>
                
                {/* User Review Action */}
                {!user.isAdmin && order.orderStatus === 'Delivered' && !review && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setShowReviewModal(true)}>Write Review</button>
                )}
            </div>

            {/* Display Review */}
            {review && (
                <div className="bg-secondary p-2 rounded mt-2">
                    <div className="d-flex justify-content-between">
                        <small className="fw-bold">Review:</small>
                        <small className="text-warning">{'★'.repeat(review.rating)}</small>
                    </div>
                    <p className="mb-1 small">{review.comment}</p>
                    
                    {/* Admin Reply Display */}
                    {review.adminReply && (
                        <div className="ps-3 border-start border-primary mt-2">
                            <small className="fw-bold text-primary d-block">Admin Reply:</small>
                            <small>{review.adminReply.text}</small>
                        </div>
                    )}

                    {/* Admin Reply Action */}
                    {user.isAdmin && !review.adminReply && (
                        <div className="mt-2">
                            {!showReplyForm ? (
                                <button className="btn btn-sm btn-link text-info p-0" onClick={() => setShowReplyForm(true)}>Reply</button>
                            ) : (
                                <div className="mt-2">
                                    <textarea className="form-control form-control-sm bg-dark text-light border-secondary mb-2" rows="2" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..."></textarea>
                                    <button className="btn btn-sm btn-primary me-2" onClick={submitReply} disabled={submittingReply}>
                                        {submittingReply ? 'Sending...' : 'Submit'}
                                    </button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => setShowReplyForm(false)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-light border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">Review {item.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowReviewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Rating</label>
                                    <select className="form-select bg-dark text-light border-secondary" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Comment</label>
                                    <textarea className="form-control bg-dark text-light border-secondary" rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={submitReview} disabled={submittingReview}>
                                    {submittingReview ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

const OrderDetailsScreen = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toasts, setToasts] = useState([]);
    const [cancelling, setCancelling] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    setError(data.message || 'Failed to fetch order');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId, user]);

    const cancelOrderHandler = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setCancelling(true);
            try {
                const res = await fetch(`/api/orders/${orderId}/cancel`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const updatedOrder = await res.json();
                    setOrder(updatedOrder);
                    alert('Order cancelled successfully');
                } else {
                    alert('Failed to cancel order');
                }
            } catch (err) {
                console.error(err);
                alert('Error cancelling order');
            } finally {
                setCancelling(false);
            }
        }
    };

    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
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

    if (error) {
        return (
            <div className="container-fluid bg-dark pb-5 text-center text-light" style={{ minHeight: '100vh', paddingTop: '120px' }}>
                <h2 className="text-danger">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-dark pb-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            {/* Toast Container */}
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            <div className="container">
                {user && user.isAdmin && (
                    <button onClick={() => navigate('/admin/dashboard')} className="btn btn-outline-light mb-4">
                        &larr; Back to Dashboard
                    </button>
                )}
                <h2 className="mb-4 text-center fw-bold text-uppercase" style={gradientTextStyle}>Order {order._id}</h2>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-3" style={gradientTextStyle}>Shipping</h4>
                                <p><strong>Name: </strong> {order.user.name}</p>
                                <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-info">{order.user.email}</a></p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                                <div className="mt-3">
                                    <strong>Status: </strong>
                                    <span className={`badge ${order.orderStatus === 'Delivered' ? 'bg-success' : order.orderStatus === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{order.orderStatus || 'Processing'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-3" style={gradientTextStyle}>Payment Method</h4>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <div className="alert alert-success">Paid on {order.paidAt}</div>
                                ) : (
                                    <div className="alert alert-danger">Not Paid</div>
                                )}
                            </div>
                        </div>

                        <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title text-uppercase mb-3" style={gradientTextStyle}>Order Items</h4>
                                {order.orderItems.length === 0 ? (
                                    <p>Order is empty</p>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {order.orderItems.map((item, index) => (
                                            <OrderItem key={index} item={item} order={order} user={user} showToast={showToast} />
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
                                <div className="d-flex justify-content-between mb-2"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
                                <hr className="border-secondary" />
                                <div className="d-flex justify-content-between mb-4 fs-5 fw-bold"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
                                {order.orderStatus === 'Processing' && !user.isAdmin && (
                                    <button onClick={cancelOrderHandler} className="btn btn-danger w-100 mt-3" disabled={cancelling}>
                                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsScreen;