import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

const EditArtModal = ({ isOpen, art, onClose, fetchPaintings, services, showToast }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [originalImages, setOriginalImages] = useState([]);

    useEffect(() => {
        if (art) {
            setTitle(art.title);
            setCategory(art.category || '');
            setDescription(art.description || '');
            // Use images array if available, otherwise fallback to single imageUrl wrapped in array
            const initialImages = art.images && art.images.length > 0 ? art.images : (art.imageUrl ? [art.imageUrl] : []);
            setImages(initialImages);
            setOriginalImages(initialImages);
            setSelectedFiles([]);
        }
    }, [art]);

    const handleRemoveImage = (imageToRemove) => {
        setImages(images.filter(img => img !== imageToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let newImageUrls = [];

            if (selectedFiles.length > 0) {
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
                newImageUrls = uploadData.imageUrls;
            }

            // Combine existing (non-deleted) images with new uploads
            const finalImageUrls = [...images, ...newImageUrls];
            
            // Determine which original images were removed to send to backend for deletion
            const imagesToDelete = originalImages.filter(img => !images.includes(img));

            const response = await fetch(`/api/admin/paintings/${art._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    title, 
                    category, 
                    description, 
                    images: finalImageUrls, 
                    imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : '',
                    oldImages: imagesToDelete
                }),
            });
            if (response.ok) {
                showToast('Artwork updated successfully!');
                fetchPaintings();
                onClose();
            } else {
                const errorData = await response.text();
                console.error('Failed to update artwork:', errorData);
                showToast(`Failed to update artwork: ${errorData}`, 'error');
            }
        } catch (error) {
            console.error('Error updating artwork:', error);
            showToast(`An error occurred while updating: ${error.message}`, 'error');
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
                        <h5 className="modal-title">Edit Artwork</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control bg-secondary text-white border-0" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select className="form-select bg-secondary text-white border-0" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="">Select Service</option>
                                    {services.map(service => <option key={service._id} value={service._id}>{service.title}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control bg-secondary text-white border-0" rows="3"></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Current Images</label>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    {images.map((img, index) => (
                                        <div key={index} className="position-relative">
                                            <img src={img} alt={`Artwork ${index}`} className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            <button 
                                                type="button" 
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center" 
                                                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                                                onClick={() => handleRemoveImage(img)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    {images.length === 0 && <p className="text-muted small">No images available.</p>}
                                </div>
                                <label className="form-label">Add New Images</label>
                                <ImageUpload
                                    // No initialImageUrl passed, so it starts empty for new uploads
                                    onFileSelect={(files) => setSelectedFiles(files)}
                                    multiple={true}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Artwork'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditArtModal;