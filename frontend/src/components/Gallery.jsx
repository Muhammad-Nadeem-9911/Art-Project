import React from 'react';
import { Link } from 'react-router-dom';
const Gallery = ({ paintings, loading, onArtDeleted, isAdmin = false }) => {

    const handleDelete = async (id) => { //TODO: Implement in backend
        if (!window.confirm('Are you sure you want to delete this painting?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/paintings/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete painting');
            }
            // Trigger a refresh in the parent component
            onArtDeleted();
        } catch (error) {
            console.error('Error deleting painting:', error);
        }
    };

    return (
        <div id="gallery" className="container-fluid py-5">
            <div className="container py-5">
               <div className="text-center">
                    <div className="title wow fadeInUp" data-wow-delay="0.1s">
                        <div className="title-center">
                            <h5>Gallery</h5>
                            <h1>My Latest Artwork</h1>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center col-12">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading your masterpieces...</p>
                    </div>
                ) : paintings.length > 0 ? (
                    paintings.map((art, index) => {
                        const isLeft = index % 2 === 0;
                        const itemClass = isLeft ? 'service-item-left' : 'service-item-right';
                        const imageOrderClass = isLeft ? '' : 'order-md-1';
                        const textAlignClass = isLeft ? '' : 'text-md-end';
                        const animation = isLeft ? 'fadeInRight' : 'fadeInLeft';

                        return (
                            <div key={art._id} className={`service-item ${itemClass}`}>
                                <div className="row g-0 align-items-center">
                                    <div className={`col-md-5 ${imageOrderClass}`}>
                                        <div className={`service-img p-5 position-relative wow ${animation}`} data-wow-delay="0.2s">
                                            <img className="img-fluid rounded-circle" src={art.imageUrl} alt={art.title} />
                                            {isAdmin && (
                                                <div className="position-absolute top-0 end-0 p-3">
                                                    <button onClick={() => handleDelete(art._id)} className="btn btn-sm btn-danger rounded-circle" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className={`service-text px-5 px-md-0 py-md-5 ${textAlignClass} wow ${animation}`} data-wow-delay="0.5s">
                                            <h3 className="text-uppercase">{art.title}</h3>
                                            <p className="mb-4">{art.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12 text-center"><p>The gallery is currently empty. New art is coming soon!</p></div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
