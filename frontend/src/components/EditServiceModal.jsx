import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

const EditServiceModal = ({ isOpen, service, onClose, fetchServices, showToast }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (service) {
            setTitle(service.title);
            setDescription(service.description);
            setImageUrl(service.imageUrl);
            setSelectedFile(null);
        }
    }, [service]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let finalImageUrl = imageUrl;

            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', selectedFile);
                const uploadRes = await fetch('http://localhost:5000/api/admin/upload', {
                    method: 'POST',
                    body: uploadFormData
                });
                if(!uploadRes.ok) throw new Error('Upload failed');
                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.imageUrl;
            }

            const response = await fetch(`http://localhost:5000/api/admin/services/${service._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, imageUrl: finalImageUrl, oldImage: selectedFile ? service.imageUrl : null }),
            });
            if (response.ok) {
                showToast('Service updated successfully!');
                fetchServices();
                onClose();
            } else {
                const errorData = await response.text();
                console.error('Failed to update service:', errorData);
                showToast(`Failed to update service: ${errorData}`, 'error');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            showToast(`An error occurred while updating: ${error.message}`, 'error');
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
                        <h5 className="modal-title">Edit Service</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control bg-secondary text-white border-0" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control bg-secondary text-white border-0" rows="3"></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <ImageUpload
                                    initialImageUrl={imageUrl}
                                    onFileSelect={(file) => setSelectedFile(file)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Service'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditServiceModal;