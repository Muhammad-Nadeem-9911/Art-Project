import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const AddCarouselModal = ({ isOpen, onClose, fetchSlides, showToast }) => {
    const [formData, setFormData] = useState({ title: '', subtitle: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            showToast('Please upload an image for the slide.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', selectedFile);
            const uploadRes = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadFormData
            });
            if(!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();
            const finalImageUrl = uploadData.imageUrl;

            await fetch('/api/admin/carousel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, imageUrl: finalImageUrl })
            });
            
            showToast('Slide added successfully!');
            fetchSlides();
            onClose();
        } catch (err) {
            console.error(err);
            showToast('Error adding slide: ' + err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title">Add New Slide</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-control bg-secondary text-white border-0" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Subtitle</label>
                                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="form-control bg-secondary text-white border-0" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <ImageUpload
                                    onFileSelect={(file) => setSelectedFile(file)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Add Slide'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCarouselModal;