import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageHeader from './PageHeader';

const CategoryArtworks = () => {
    const { categoryId } = useParams();
    const [artworks, setArtworks] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState('Artworks');
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

    useEffect(() => {
        const spinner = document.getElementById('spinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
        if (window.WOW) {
            new window.WOW().init();
        }
    }, []);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const response = await fetch(`${API_URL}/api/paintings/category/${categoryId}`);
                if (response.ok) {
                    const data = await response.json();
                    setArtworks(data);
                    
                    // Try to set title from the first artwork's populated category
                    if (data.length > 0 && data[0].category) {
                        setCategoryTitle(data[0].category.title);
                    } else {
                        // Fallback: fetch service details if no artworks exist yet
                        const serviceRes = await fetch(`${API_URL}/api/content/services`);
                        if (serviceRes.ok) {
                            const services = await serviceRes.json();
                            const service = services.find(s => s._id === categoryId);
                            if (service) setCategoryTitle(service.title);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch artworks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, [categoryId]);

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
            <PageHeader title={categoryTitle} pageName="services" />
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                        <h5 className="text-uppercase" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Portfolio</h5>
                        <h1 className="display-5 text-uppercase mb-4">{categoryTitle} Collection</h1>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status" style={{ color: '#00BCF2' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : artworks.length > 0 ? (
                        <div className="row g-4">
                            {artworks.map((art) => (
                                <div key={art._id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s" >
                                    <Link to={`/artwork/${art._id}`} className="text-decoration-none">
                                        <div className="bg-light rounded overflow-hidden shadow-sm h-100">
                                            <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                                                <img className="img-fluid w-100 h-100" src={art.imageUrl} alt={art.title} style={{ objectFit: 'cover' }} />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-uppercase mb-2 text-dark">{art.title}</h4>
                                                <p className="text-muted mb-0" style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '2',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}>{art.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <p className="fs-4 text-muted">No artworks found in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CategoryArtworks;