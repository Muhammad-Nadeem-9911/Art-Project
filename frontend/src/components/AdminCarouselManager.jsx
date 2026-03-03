import React, { useState, useEffect } from 'react';

const AdminCarouselManager = ({ showToast, showConfirm }) => {
    const [slides, setSlides] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: null
    });
    
    const fetchSlides = async () => {
        try {
            const res = await fetch(`/api/content/carousel`);
            const data = await res.json();
            setSlides(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const url = editingId 
                ? `/api/admin/carousel/${editingId}`
                : `/api/admin/carousel`;
            
            const method = editingId ? 'PUT' : 'POST';

            // If editing, send old image url to handle deletion if new image is uploaded
            if (editingId) {
                const currentSlide = slides.find(s => s._id === editingId);
                if (currentSlide && currentSlide.imageUrl) {
                    data.append('oldImage', currentSlide.imageUrl);
                }
            }

            const res = await fetch(url, {
                method: method,
                body: data
            });

            if (res.ok) {
                showToast(editingId ? 'Slide updated!' : 'Slide created!', 'success');
                setFormData({ title: '', subtitle: '', image: null });
                setEditingId(null);
                setShowForm(false);
                fetchSlides();
                // Reset file input
                const fileInput = document.getElementById('carouselImageInput');
                if(fileInput) fileInput.value = '';
            } else {
                showToast('Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving slide:', error);
            showToast('Error saving slide', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        showConfirm("Delete this slide?", async () => {
            try {
                await fetch(`/api/admin/carousel/${id}`, { method: 'DELETE' });
                fetchSlides();
                showToast('Slide deleted successfully');
            } catch (err) {
                console.error(err);
                showToast('Error deleting slide', 'error');
            }
        });
    };

    const handleEdit = (slide) => {
        setEditingId(slide._id);
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle,
            image: null
        });
        setShowForm(true);
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
                `}
            </style>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <h3 className="mb-0">Homepage Carousel</h3>
                <button className="btn btn-primary w-100 w-md-auto" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', subtitle: '', image: null }); }}>
                    <i className="fas fa-plus me-2"></i>Add New Slide
                </button>
            </div>

            {showForm && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }} tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content bg-dark text-light border-secondary shadow-lg">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title text-uppercase fw-bold" style={gradientTextStyle}>
                                {editingId ? 'Edit Slide' : 'Add New Slide'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Title</label>
                                        <input type="text" className="form-control form-control-dark" name="title" value={formData.title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Subtitle</label>
                                        <input type="text" className="form-control form-control-dark" name="subtitle" value={formData.subtitle} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Image</label>
                                        <input type="file" className="form-control form-control-dark" name="image" id="carouselImageInput" onChange={handleInputChange} required={!editingId} />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn w-100 fw-bold" style={gradientButtonStyle} disabled={loading}>
                                            {loading ? <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...</span> : (editingId ? 'Update Slide' : 'Add Slide')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* List */}
            <div className="row g-4">
                {slides.map(slide => (
                    <div key={slide._id} className="col-12 col-md-6 col-lg-4">
                        <div className="card bg-dark text-light border-secondary h-100 shadow-sm">
                            <div className="position-relative" style={{ height: '200px' }}>
                                <img src={slide.imageUrl} className="card-img-top w-100 h-100" alt={slide.title} style={{ objectFit: 'cover' }} />
                                <div className="position-absolute top-0 end-0 p-2">
                                    <button className="btn btn-sm btn-light me-2" onClick={() => handleEdit(slide)}><i className="fas fa-edit text-primary"></i></button>
                                    <button className="btn btn-sm btn-light" onClick={() => handleDelete(slide._id)}><i className="fas fa-trash text-danger"></i></button>
                                </div>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title text-uppercase fw-bold" style={gradientTextStyle}>{slide.title}</h5>
                                <p className="card-text text-muted">{slide.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCarouselManager;
