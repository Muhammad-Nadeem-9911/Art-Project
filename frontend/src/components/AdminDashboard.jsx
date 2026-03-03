import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import AuthContext from '../context/AuthContext';
import AdminPanel from './AdminPanel';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });
    const [activeView, setActiveView] = useState('overview');
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        monthlySales: [],
        orderStatusCounts: [],
        recentOrders: [],
        newUsersCount: 0,
        topProducts: []
    });
    const [loading, setLoading] = useState(true);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const showConfirm = (message, onConfirm) => {
        setConfirmModal({
            isOpen: true,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmModal({ isOpen: false, message: '', onConfirm: null });
            }
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                showToast('Failed to load dashboard data', 'error');
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
            showToast('Server connection error', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && user.isAdmin) fetchAnalytics();
    }, [user]);

    const maxSales =
        stats.monthlySales.reduce((acc, item) => Math.max(acc, item.sales), 0) || 1;

    const totalStatusOrders =
        stats.orderStatusCounts.reduce((acc, item) => acc + item.count, 0) || 1;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Processing': return 'bg-warning text-dark';
            case 'Ready to Ship': return 'bg-info text-dark';
            case 'Shipped': return 'bg-primary';
            case 'Delivered': return 'bg-success';
            case 'Cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="bg-dark min-vh-100">

            {/* Toasts */}
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() =>
                    setConfirmModal({ isOpen: false, message: '', onConfirm: null })
                }
            />

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-secondary px-4 py-3 shadow">
                <h2 className="navbar-brand text-primary text-uppercase mb-0">
                    Admin Panel
                </h2>
                <div className="ms-auto">
                    <button onClick={handleLogout} className="btn btn-outline-danger">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container py-5" style={{ marginTop: '100px' }}>

                {/* View Switch */}
                <div className="d-flex justify-content-center mb-5">
                    <div className="btn-group">
                        <button
                            className={`btn ${activeView === 'overview'
                                ? 'btn-primary'
                                : 'btn-outline-secondary text-light'}`}
                            onClick={() => setActiveView('overview')}
                        >
                            Dashboard Overview
                        </button>

                        <button
                            className={`btn ${activeView === 'management'
                                ? 'btn-primary'
                                : 'btn-outline-secondary text-light'}`}
                            onClick={() => setActiveView('management')}
                        >
                            Content Management
                        </button>
                    </div>
                </div>

                {/* MAIN CONDITIONAL RENDERING (FIXED) */}
                {activeView === 'overview' ? (
                    loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                            <div className="spinner-border text-primary" />
                        </div>
                    ) : (
                        <div className="animate__animated animate__fadeIn">

                            {/* Stats Cards */}
                            <div className="row g-4 mb-5">
                                <div className="col-12 col-sm-6 col-xl-3">
                                    <div className="card bg-secondary text-light text-center">
                                        <div className="card-body">
                                            <h5>Total Revenue</h5>
                                            <h2 className="text-success">
                                                ${stats.totalSales.toFixed(2)}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-sm-6 col-xl-3">
                                    <div className="card bg-secondary text-light text-center">
                                        <div className="card-body">
                                            <h5>Total Orders</h5>
                                            <h2 className="text-info">
                                                {stats.totalOrders}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-sm-6 col-xl-3">
                                    <div className="card bg-secondary text-light text-center">
                                        <div className="card-body">
                                            <h5>Total Artworks</h5>
                                            <h2 className="text-warning">
                                                {stats.totalProducts}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-sm-6 col-xl-3">
                                    <div className="card bg-secondary text-light text-center">
                                        <div className="card-body">
                                            <h5>New Users (30d)</h5>
                                            <h2 className="text-primary">
                                                {stats.newUsersCount}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="card bg-secondary text-light">
                                <div className="card-header bg-dark">
                                    <h5 className="mb-0">Recent Orders</h5>
                                </div>

                                <div className="card-body p-0 table-responsive">
                                    <table className="table table-dark mb-0">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders.map(order => (
                                                <tr key={order._id}>
                                                    <td>{order._id}</td>
                                                    <td>{order.user?.name || 'N/A'}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>${order.totalPrice.toFixed(2)}</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(order.orderStatus || 'Processing')}`}>
                                                            {order.orderStatus || 'Processing'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )
                ) : (
                    <AdminPanel
                        showToast={showToast}
                        showConfirm={showConfirm}
                        refreshAnalytics={fetchAnalytics}
                    />
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;