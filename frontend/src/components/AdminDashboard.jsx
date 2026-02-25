import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCarouselManager from './AdminCarouselManager';
import AdminPageContentManager from './AdminPageContentManager';
import AdminServicesManager from './AdminServicesManager';
import AdminArtManager from './AdminArtManager';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });

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
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin/login');
    };

    return (
        <div className="bg-dark min-vh-100">
            {/* Toast Container */}
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </div>

            {/* Confirm Modal */}
            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                message={confirmModal.message} 
                onConfirm={confirmModal.onConfirm} 
                onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: null })} 
            />

            <nav className="navbar navbar-expand-lg navbar-dark bg-secondary px-4 py-3 shadow">
                <h2 className="navbar-brand text-primary text-uppercase mb-0">Admin Panel</h2>
                <div className="ms-auto d-flex gap-3">
                    <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                </div>
            </nav>

            <div className="container py-5" style={{ marginTop: '100px' }}>
                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-fill mb-4" id="adminTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="art-tab" data-bs-toggle="tab" data-bs-target="#art-panel" type="button" role="tab">Manage Art Gallery</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="carousel-tab" data-bs-toggle="tab" data-bs-target="#carousel-panel" type="button" role="tab">Manage Homepage Carousel</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="content-tab" data-bs-toggle="tab" data-bs-target="#content-panel" type="button" role="tab">Manage Page Headers</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="services-tab" data-bs-toggle="tab" data-bs-target="#services-panel" type="button" role="tab">Manage Services</button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content" id="adminTabContent">
                    <div className="tab-pane fade show active" id="art-panel" role="tabpanel">
                        <AdminArtManager showToast={showToast} showConfirm={showConfirm} />
                    </div>
                    <div className="tab-pane fade" id="carousel-panel" role="tabpanel">
                        <AdminCarouselManager showToast={showToast} showConfirm={showConfirm} />
                    </div>
                    <div className="tab-pane fade" id="content-panel" role="tabpanel">
                        <AdminPageContentManager showToast={showToast} />
                    </div>
                    <div className="tab-pane fade" id="services-panel" role="tabpanel">
                        <AdminServicesManager showToast={showToast} showConfirm={showConfirm} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;