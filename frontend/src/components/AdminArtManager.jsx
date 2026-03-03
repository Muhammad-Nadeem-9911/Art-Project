import React, { useState, useEffect } from 'react';

const AdminArtManager = ({ showToast, showConfirm }) => {
    const [artworks, setArtworks] = useState([]);
    const [services, setServices] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        price: '',
        countInStock: '',
        files: []
    });

    useEffect(() => {
        fetchArtworks();
        fetchServices();
    }, []);

    const fetchArtworks = async () => {
        try {
            const res = await fetch(`/api/admin/paintings`);
            const data = await res.json();
            setArtworks(data);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`/api/content/services`);
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'images') {
            setFormData({ ...formData, files: e.target.files });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const removeExistingImage = (imgUrl) => {
        setExistingImages(existingImages.filter(img => img !== imgUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('countInStock', formData.countInStock);
        
        existingImages.forEach(img => data.append('keptImages', img));
        
        if (formData.files) {
            for (let i = 0; i < formData.files.length; i++) {
                data.append('images', formData.files[i]);
            }
        }

        try {
            const url = editingId 
                ? `/api/admin/paintings/${editingId}`
                : `/api/admin/paintings`;
            
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                body: data
            });

            if (res.ok) {
                showToast(editingId ? 'Artwork updated!' : 'Artwork created!', 'success');
                setFormData({ title: '', category: '', description: '', price: '', countInStock: '', files: [] });
                setExistingImages([]);
                setEditingId(null);
                setShowForm(false);
                fetchArtworks();
            } else {
                showToast('Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving artwork:', error);
            showToast('Error saving artwork', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (art) => {
        setEditingId(art._id);
        setFormData({
            title: art.title,
            category: art.category?._id || art.category || '',
            description: art.description,
            price: art.price || 0,
            countInStock: art.countInStock || 0,
            files: []
        });
        
        if (art.images && art.images.length > 0) {
            setExistingImages(art.images);
        } else if (art.imageUrl) {
            setExistingImages([art.imageUrl]);
        } else {
            setExistingImages([]);
        }
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this artwork?')) {
            try {
                const res = await fetch(`/api/admin/paintings/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    showToast('Artwork deleted', 'success');
                    fetchArtworks();
                }
            } catch (error) {
                console.error('Error deleting artwork:', error);
            }
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
        <div className="p-4">
            <style>
                {`
                    .form-control-dark {
                        background-color: #212529;
                        border-color: #495057;
                        color: #fff;
                    }
                    .form-control-dark:focus {
                        background-color: #212529;
                        border-color: #00BCF2;
                        color: #fff;
                        box-shadow: 0 0 0 0.25rem rgba(0, 188, 242, 0.25);
                    }
                    .form-control-dark::placeholder {
                        color: #6c757d;
                    }
                    .form-select-dark {
                        background-color: #212529;
                        border-color: #495057;
                        color: #fff;
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
                    }
                    .form-select-dark:focus {
                        background-color: #212529;
                        border-color: #00BCF2;
                        color: #fff;
                        box-shadow: 0 0 0 0.25rem rgba(0, 188, 242, 0.25);
                    }
                `}
            </style>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <h3 className="mb-0">Manage Art Gallery</h3>
                <button className="btn btn-primary w-100 w-md-auto" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', category: '', description: '', price: '', countInStock: '', files: [] }); setExistingImages([]); }}>
                    <i className="fas fa-plus me-2"></i>Add Artwork
                </button>
            </div>

            {showForm && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }} tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content bg-dark text-light border-secondary shadow-lg">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title text-uppercase fw-bold" style={gradientTextStyle}>
                                {editingId ? 'Edit Artwork' : 'Add New Artwork'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
                        </div>
                        <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control form-control-dark" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label">Category</label>
                        <select className="form-select form-select-dark" name="category" value={formData.category} onChange={handleInputChange} required>
                            <option value="">Select Category</option>
                            {services.map(s => (
                                <option key={s._id} value={s._id}>{s.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label">Price ($)</label>
                        <input type="number" className="form-control form-control-dark" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label">Stock Quantity</label>
                        <input type="number" className="form-control form-control-dark" name="countInStock" value={formData.countInStock} onChange={handleInputChange} required min="0" />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea className="form-control form-control-dark" name="description" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
                    </div>
                    <div className="col-12">
                        <label className="form-label">Images</label>
                        <input type="file" className="form-control form-control-dark" name="images" id="imageInput" onChange={handleInputChange} multiple required={!editingId && existingImages.length === 0} />
                        
                        {existingImages.length > 0 && (
                            <div className="mt-3 d-flex flex-wrap gap-2">
                                {existingImages.map((img, index) => (
                                    <div key={index} className="position-relative">
                                        <img src={img} alt="Artwork" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" style={{ padding: '0px 5px', fontSize: '12px' }} onClick={() => removeExistingImage(img)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn w-100 fw-bold" style={gradientButtonStyle} disabled={loading}>
                            {loading ? 'Saving...' : (editingId ? 'Update Artwork' : 'Add Artwork')}
                        </button>
                    </div>
                </div>
            </form>
            </div>
            </div>
            </div>
            </div>
            )}

            <h3 className="mb-4">Existing Artworks</h3>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artworks.map(art => (
                            <tr key={art._id}>
                                <td>
                                    <img src={art.imageUrl} alt={art.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>{art.title}</td>
                                <td>{art.category?.title || services.find(s => s._id === (art.category?._id || art.category))?.title || 'Uncategorized'}</td>
                                <td>${art.price}</td>
                                <td>{art.countInStock}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(art)}><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(art._id)}><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminArtManager;