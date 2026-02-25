import React, { useState, useEffect } from 'react';
import EditArtModal from './EditArtModal';
import AddArtModal from './AddArtModal';

const AdminArtManager = ({ showToast, showConfirm }) => {
    const [paintings, setPaintings] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArt, setSelectedArt] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchPaintings = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/admin/paintings');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setPaintings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/services');
            if (!res.ok) throw new Error('Failed to fetch services');
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchPaintings(); fetchServices(); }, []);

    const handleDelete = async (id) => {
        showConfirm("Delete this artwork?", async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/admin/paintings/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete');
                showToast('Artwork deleted successfully');
                fetchPaintings();
            } catch (err) {
                console.error(err);
                showToast('Error deleting artwork', 'error');
            }
        });
    };

    const handleEdit = (art) => {
        setSelectedArt(art);
        setIsEditModalOpen(true);
    };

    return (
        <div className="bg-secondary p-4 rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white mb-0">Manage Art Gallery</h3>
                <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">Add New Art</button>
            </div>

            {/* List */}
            {loading ? (
                <p className="text-center text-light">Loading artworks...</p>
            ) : (
                <div className="row g-3">
                    {paintings.map(art => (
                        <div key={art._id} className="col-md-4">
                            <div className="position-relative">
                                <img 
                                    src={art.images && art.images.length > 0 ? art.images[0] : art.imageUrl} 
                                    alt={art.title} 
                                    className="img-fluid rounded" 
                                    style={{height: '200px', width: '100%', objectFit: 'cover'}} 
                                />
                                <button onClick={() => handleEdit(art)} className="btn btn-warning btn-sm position-absolute top-0 start-0 m-2">Edit</button>
                                <button onClick={() => handleDelete(art._id)} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">Delete</button>
                                <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 w-100 text-white">
                                    <h5 className="mb-1">{art.title}</h5>
                                    <small className="d-block">{services.find(s => s._id === art.category)?.title || 'Uncategorized'}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditModalOpen && selectedArt && (
                <EditArtModal 
                    isOpen={isEditModalOpen} 
                    art={selectedArt} 
                    onClose={() => setIsEditModalOpen(false)} 
                    fetchPaintings={fetchPaintings} 
                    services={services}
                    showToast={showToast}
                />
            )}

            <AddArtModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                fetchPaintings={fetchPaintings}
                services={services}
                showToast={showToast}
            />
        </div>
    );
};

export default AdminArtManager;