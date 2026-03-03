import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    if (!user) return null;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                <div className="row g-5">
                    <div className="col-md-4">
                        <div className="card bg-dark text-light border-secondary shadow-lg mb-4">
                            <div className="card-body text-center p-4">
                                <h2 className="mb-4 fw-bold text-uppercase" style={gradientTextStyle}>My Profile</h2>
                                <p className="fs-5 mb-2"><strong>Name:</strong> {user.name}</p>
                                <p className="fs-5 mb-4"><strong>Email:</strong> {user.email}</p>
                                <p className="mb-4">
                                    <span className="badge fs-6" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)' }}>
                                        {user.isAdmin ? 'Admin User' : 'Customer'}
                                    </span>
                                </p>
                                <button onClick={handleLogout} className="btn w-50 fw-bold" style={gradientButtonStyle}>Logout</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h2 className="mb-4 fw-bold text-uppercase" style={gradientTextStyle}>My Orders</h2>
                        {loadingOrders ? (
                            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                        ) : orders.length === 0 ? (
                            <div className="alert alert-info">You have no orders.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-dark table-hover border-secondary">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th>PAID</th>
                                            <th>DELIVERED</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order._id.substring(0, 10)}...</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>${order.totalPrice.toFixed(2)}</td>
                                                <td>
                                                    {order.isPaid ? <span className="text-success">Paid</span> : <span className="text-danger">Not Paid</span>}
                                                </td>
                                                <td>
                                                    {order.isDelivered ? <span className="text-success">Delivered</span> : <span className="text-danger">Not Delivered</span>}
                                                </td>
                                                <td>
                                                    <Link to={`/order/${order._id}`} className="btn btn-sm btn-light">Details</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfileScreen;