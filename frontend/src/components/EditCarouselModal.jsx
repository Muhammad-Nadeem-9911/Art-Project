import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

const EditCarouselModal = ({ isOpen, slide, onClose, fetchSlides, showToast }) => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (slide) {
            setTitle(slide.title);
            setSubtitle(slide.subtitle);
            setImageUrl(slide.imageUrl);
            // Reset file input when a new slide is selected
            setSelectedFile(null);
        }
    }, [slide]);

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

            const response = await fetch(`http://localhost:5000/api/admin/carousel/${slide._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send oldImage for deletion if we uploaded a new one
                body: JSON.stringify({ title, subtitle, imageUrl: finalImageUrl, oldImage: selectedFile ? slide.imageUrl : null }),
            });
            if (response.ok) {
                showToast('Slide updated successfully!');
                fetchSlides(); // Refresh slides
                onClose(); // Close modal
            } else {
                const errorData = await response.text();
                console.error('Failed to update slide:', errorData);
                showToast(`Failed to update slide: ${errorData}`, 'error');
            }
        } catch (error) {
            console.error('Error updating slide:', error);
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
                        <h5 className="modal-title">Edit Carousel Slide</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control bg-secondary text-white border-0" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Subtitle</label>
                                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="form-control bg-secondary text-white border-0" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <ImageUpload
                                    initialImageUrl={imageUrl}
                                    onFileSelect={(file) => setSelectedFile(file)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Slide'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCarouselModal;