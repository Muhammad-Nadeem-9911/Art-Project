import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import PageHeader from './PageHeader';
import AddToWishlist from './AddToWishlist';
import AddToCart from './AddToCart';
import Paginate from './Paginate';

const CategoryArtworks = () => {
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const pageNumber = Number(searchParams.get('page')) || 1;
    const [artworks, setArtworks] = useState([]);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [categoryTitle, setCategoryTitle] = useState('Artworks');
    const [loading, setLoading] = useState(true);

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
                const response = await fetch(`/api/paintings/category/${categoryId}?pageNumber=${pageNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    setArtworks(data.paintings);
                    setPages(data.pages);
                    setPage(data.page);
                    
                    // Try to set title from the first artwork's populated category
                    if (data.paintings.length > 0 && data.paintings[0].category) {
                        setCategoryTitle(data.paintings[0].category.title);
                    } else {
                        // Fallback: fetch service details if no artworks exist yet
                        const serviceRes = await fetch(`/api/content/services`);
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
    }, [categoryId, pageNumber]);

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
                                    <div className="bg-light rounded overflow-hidden shadow-sm h-100">
                                        <Link to={`/artwork/${art._id}`} className="text-decoration-none">
                                            <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                                                <img className="img-fluid w-100 h-100" src={art.imageUrl} alt={art.title} style={{ objectFit: 'cover' }} />
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <Link to={`/artwork/${art._id}`} className="text-decoration-none">
                                                <h4 className="text-uppercase mb-2 text-dark">{art.title}</h4>
                                            </Link>
                                            <p className="text-muted mb-3" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: '2',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>{art.description}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <AddToWishlist paintingId={art._id} />
                                                <AddToCart paintingId={art._id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <p className="fs-4 text-muted">No artworks found in this category yet.</p>
                        </div>
                    )}

                    <Paginate 
                        pages={pages} 
                        page={page} 
                        renderPageLink={(p) => `/category/${categoryId}?page=${p}`} 
                    />
                </div>
            </div>
        </>
    );
};

export default CategoryArtworks;