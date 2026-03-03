import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const AddArtModal = ({ isOpen, onClose, fetchPaintings, services, showToast }) => {
    const [formData, setFormData] = useState({ title: '', category: '', description: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            showToast('Please upload at least one image.', 'error');
            return;
        }
        if (!formData.category) {
            showToast('Please select a category.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const uploadFormData = new FormData();
            selectedFiles.forEach(file => {
                uploadFormData.append('images', file);
            });
            
            const uploadRes = await fetch('/api/admin/upload-multiple', {
                method: 'POST',
                body: uploadFormData
            });
            if(!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();
            const finalImageUrls = uploadData.imageUrls;

            const res = await fetch('/api/admin/paintings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData, 
                    images: finalImageUrls,
                    imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : ''
                })
            });
            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData || 'Failed to save artwork');
            }

            showToast('Artwork added successfully!');
            fetchPaintings();
            onClose();
        } catch (err) {
            console.error(err);
            showToast('Error saving artwork: ' + err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title">Add New Artwork</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-control bg-secondary text-white border-0" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select className="form-select bg-secondary text-white border-0" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                                    <option value="">Select Service</option>
                                    {services.map(service => <option key={service._id} value={service._id}>{service.title}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="form-control bg-secondary text-white border-0" rows="3"></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Images</label>
                                <ImageUpload
                                    onFileSelect={(files) => setSelectedFiles(files)}
                                    multiple={true}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Add Artwork'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddArtModal;