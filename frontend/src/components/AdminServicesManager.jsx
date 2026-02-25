import React, { useState, useEffect } from 'react';
import EditServiceModal from './EditServiceModal';
import AddServiceModal from './AddServiceModal';

 const AdminServicesManager = ({ showToast, showConfirm }) => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const fetchServices = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/services');
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchServices(); }, []);


    const handleDelete = async (id) => {
        showConfirm("Delete this service?", async () => {
            try {
                await fetch(`http://localhost:5000/api/admin/services/${id}`, { method: 'DELETE' });
                fetchServices();
                showToast('Service deleted successfully');
            } catch (err) {
                console.error(err);
                showToast('Error deleting service', 'error');
            }
        });
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setIsEditModalOpen(true);
    };

    return (
        <div className="bg-secondary p-4 rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white mb-0">Manage Services</h3>
                <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">Add New Service</button>
            </div>

            {/* List */}
            <div className="row g-3">
                {services.map(service => (
                    <div key={service._id} className="col-md-4">
                        <div className="position-relative">
                            <img src={service.imageUrl} alt={service.title} className="img-fluid rounded" style={{height: '200px', width: '100%', objectFit: 'cover'}} />
                            <button onClick={() => handleEdit(service)} className="btn btn-warning btn-sm position-absolute top-0 start-0 m-2">Edit</button>
                            <button onClick={() => handleDelete(service._id)} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">Delete</button>
                            <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 w-100 text-white">
                                <h5 className="mb-1">{service.title}</h5>
                                <small className="d-block text-truncate">{service.description}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && selectedService && (
                <EditServiceModal 
                    isOpen={isEditModalOpen} 
                    service={selectedService} 
                    onClose={() => setIsEditModalOpen(false)} 
                    fetchServices={fetchServices} 
                    showToast={showToast}
                />
            )}

            <AddServiceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                fetchServices={fetchServices}
                showToast={showToast}
            />
        </div>
    );

};

export default AdminServicesManager;