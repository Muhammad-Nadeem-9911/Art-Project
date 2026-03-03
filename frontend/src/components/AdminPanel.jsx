import React from 'react';
import AdminCarouselManager from './AdminCarouselManager';
import AdminPageContentManager from './AdminPageContentManager';
import AdminServicesManager from './AdminServicesManager';
import AdminArtManager from './AdminArtManager';
import AdminOrderManager from './AdminOrderManager';
import AdminReviewManager from './AdminReviewManager';

const AdminPanel = ({ showToast, showConfirm, refreshAnalytics }) => {
    return (
        <div>
            {/* Tab Navigation */}
            <ul className="nav nav-tabs nav-fill mb-4 flex-column flex-md-row" id="adminTab" role="tablist">
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
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders-panel" type="button" role="tab">Manage Orders</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews-panel" type="button" role="tab">Manage Reviews</button>
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
                <div className="tab-pane fade" id="orders-panel" role="tabpanel">
                    <AdminOrderManager showToast={showToast} refreshAnalytics={refreshAnalytics} />
                </div>
                <div className="tab-pane fade" id="reviews-panel" role="tabpanel">
                    <AdminReviewManager showToast={showToast} />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;