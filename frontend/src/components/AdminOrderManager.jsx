import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminOrderManager = ({ showToast, refreshAnalytics }) => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [markingPaid, setMarkingPaid] = useState(null); // Stores ID of order being marked
    const { user } = useContext(AuthContext);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
            showToast('Error fetching orders', 'error');
        }
    };

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchOrders();
        }
    }, [user]);

    const updateStatusHandler = async (id, status) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                showToast(`Order status updated to ${status}`);
                fetchOrders();
                setShowStatusModal(false); // Close modal on success
            } else {
                showToast('Error updating order', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error updating order', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const markAsPaidHandler = async (id) => {
        setMarkingPaid(id);
        try {
            const res = await fetch(`/api/orders/${id}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    id: 'admin_manual',
                    status: 'COMPLETED',
                    update_time: new Date().toISOString(),
                    email_address: user.email
                })
            });
            if (res.ok) {
                showToast('Order marked as paid');
                fetchOrders();
                if (refreshAnalytics) refreshAnalytics();
            } else {
                showToast('Error marking order as paid', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error connecting to server', 'error');
        } finally {
            setMarkingPaid(null);
        }
    };

    const filteredOrders = orders.filter(order => 
        filterStatus === 'All' ? true : (order.orderStatus || 'Processing') === filterStatus
    );

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
        <>
        {/* Status Update Modal */}
        {showStatusModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1055 }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-dark text-light border-secondary">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title">Update Order Status</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowStatusModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Order ID: <strong>{selectedOrder?._id}</strong></p>
                            <div className="mb-3">
                                <label htmlFor="statusSelect" className="form-label">New Status</label>
                                <select 
                                    id="statusSelect"
                                    className="form-select w-auto bg-dark text-light border-secondary" 
                                    value={newStatus} 
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Ready to Ship">Ready to Ship</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer border-secondary">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>Cancel</button>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={() => updateStatusHandler(selectedOrder._id, newStatus)}
                                disabled={updatingStatus}
                                style={{
                                    background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
                                    border: 'none'
                                }}
                            >
                                {updatingStatus ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <h3 className="mb-0">Manage Orders</h3>
                <div className="d-flex align-items-center w-100 w-md-auto">
                    <label htmlFor="statusFilter" className="me-2 fw-bold">Filter:</label>
                    <select 
                        id="statusFilter" 
                        className="form-select w-auto bg-dark text-light border-secondary flex-grow-1 flex-md-grow-0" 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready to Ship">Ready to Ship</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>
                                    {order.isPaid ? (
                                        <span className="text-success">{order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'Paid'}</span>
                                    ) : (
                                        <span className="text-danger">Not Paid</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`badge ${getStatusBadge(order.orderStatus || 'Processing')}`}>
                                        {order.orderStatus || 'Processing'}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/admin/order/${order._id}`} className="btn btn-sm btn-light me-2">
                                        Details
                                    </Link>
                                    <button 
                                        className="btn btn-sm btn-outline-light"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setNewStatus(order.orderStatus || 'Processing');
                                            setShowStatusModal(true);
                                        }}
                                    >Update Status</button>
                                    {!order.isPaid && (
                                        <button 
                                            className="btn btn-sm btn-success ms-2 text-nowrap"
                                            onClick={() => markAsPaidHandler(order._id)}
                                            disabled={markingPaid === order._id}
                                            title="Mark as Paid (COD Received)"
                                        >
                                            {markingPaid === order._id ? 'Processing...' : <><i className="bi bi-cash-coin me-1"></i> Mark Paid</>}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default AdminOrderManager;
