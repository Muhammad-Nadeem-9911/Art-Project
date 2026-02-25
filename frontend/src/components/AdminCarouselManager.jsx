import React, { useState, useEffect } from 'react';
import EditCarouselModal from './EditCarouselModal';
import AddCarouselModal from './AddCarouselModal';

const AdminCarouselManager = ({ showToast, showConfirm }) => {
    const [slides, setSlides] = useState([]);
    const [selectedSlide, setSelectedSlide] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    

    const fetchSlides = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/carousel');
            const data = await res.json();
            setSlides(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleDelete = async (id) => {
        showConfirm("Delete this slide?", async () => {
            try {
                await fetch(`http://localhost:5000/api/admin/carousel/${id}`, { method: 'DELETE' });
                fetchSlides();
                showToast('Slide deleted successfully');
            } catch (err) {
                console.error(err);
                showToast('Error deleting slide', 'error');
            }
        });
    };

    const handleEdit = (slide) => {
        setSelectedSlide(slide);
        setIsEditModalOpen(true);
    };

    return (
        <div className="bg-secondary p-4 rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white mb-0">Homepage Carousel</h3>
                <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">Add New Slide</button>
            </div>

            {/* List */}
            <div className="row g-3">
                {slides.map(slide => (
                    <div key={slide._id} className="col-md-4">
                        <div className="position-relative">
                            <img src={slide.imageUrl} alt={slide.title} className="img-fluid rounded" style={{height: '150px', width: '100%', objectFit: 'cover'}} />
                            <button onClick={() => handleEdit(slide)} className="btn btn-warning btn-sm position-absolute top-0 start-0 m-2">Edit</button>
                            <button onClick={() => handleDelete(slide._id)} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">Delete</button>
                            <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 w-100 text-white">
                                <small className="fw-bold">{slide.title}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && selectedSlide && (
                <EditCarouselModal 
                    isOpen={isEditModalOpen} 
                    slide={selectedSlide} 
                    onClose={() => setIsEditModalOpen(false)} 
                    fetchSlides={fetchSlides} 
                    showToast={showToast}
                />
            )}

            <AddCarouselModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                fetchSlides={fetchSlides}
                showToast={showToast}
            />
        </div>
    );
};

export default AdminCarouselManager;
