import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageHeader from './PageHeader';

const SingleArtwork = () => {
    const { artworkId } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

    useEffect(() => {
        const spinner = document.getElementById('spinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
    }, []);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                const response = await fetch(`${API_URL}/api/paintings/${artworkId}`);
                if (response.ok) {
                    const data = await response.json();
                    setArtwork(data);
                }
            } catch (error) {
                console.error("Failed to fetch artwork:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [artworkId]);

    const handleMouseMove = (e) => {
        const container = e.currentTarget;
        const img = container.querySelector('img');
        if (img) {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
        }
    };

    const handleMouseEnter = (e) => {
        const img = e.currentTarget.querySelector('img');
        if (img) {
            img.style.transform = 'scale(2)';
        }
    };

    const handleMouseLeave = (e) => {
        const img = e.currentTarget.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
            img.style.transformOrigin = 'center center';
        }
    };


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status" style={{ color: '#00BCF2' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!artwork) {
        return (
            <>
                <Navbar />
                <PageHeader title="Not Found" />
                <div className="container py-5 text-center">
                    <h2>Artwork not found.</h2>
                </div>
                <Footer />
            </>
        );
    }

    const imageList = artwork.images && artwork.images.length > 0 ? artwork.images : [artwork.imageUrl];

    return (
        <>
            <style>
                {`
                    .breadcrumb-item.active {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: transparent !important;
                    }
                `}
            </style>
            <Navbar />
            <PageHeader title={artwork.title} pageName="artwork" />
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-7">
                            <div id="artworkCarousel" className="carousel slide shadow-lg rounded" data-bs-ride="carousel">
                                <div className="carousel-inner rounded">
                                    {imageList.map((img, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <div style={{
                                                height: '500px',
                                                backgroundColor: '#212529', // Dark background for aspect ratio
                                                overflow: 'hidden', // Hides the overflowed parts of the image on zoom
                                                cursor: 'crosshair'
                                            }}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            onMouseMove={handleMouseMove}
                                            >
                                                <img 
                                                    src={img} 
                                                    className="d-block w-100" 
                                                    alt={`${artwork.title} - view ${index + 1}`} 
                                                    style={{ 
                                                        height: '100%', 
                                                        objectFit: 'contain',
                                                        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                                        willChange: 'transform',
                                                        transformOrigin: 'center center'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {imageList.length > 1 && (
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#artworkCarousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#artworkCarousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <h1 className="display-5 text-uppercase mb-4">{artwork.title}</h1>
                            <div className="mb-4"><span className="badge fs-6" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)' }}>{artwork.category?.title || 'Uncategorized'}</span></div>
                            <p className="fs-5">{artwork.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SingleArtwork;