import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import PageHeader from './PageHeader';
import AddToWishlist from './AddToWishlist';
import AddToCart from './AddToCart';
import Paginate from './Paginate';

const SearchResults = () => {
    const { keyword } = useParams();
    const [searchParams] = useSearchParams();
    const pageNumber = Number(searchParams.get('page')) || 1;
    const [artworks, setArtworks] = useState([]);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const response = await fetch(`/api/paintings?keyword=${keyword}&pageNumber=${pageNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    setArtworks(data.paintings);
                    setPages(data.pages);
                    setPage(data.page);
                }
            } catch (error) {
                console.error("Failed to fetch artworks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, [keyword, pageNumber]);

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
            <div className="container-fluid bg-dark" style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '120px', paddingBottom: '5rem' }}>
                <div className="container">
                    <h2 className="mb-5 text-center fw-bold text-uppercase" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Search Results for "{keyword}"</h2>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status" style={{ color: '#00BCF2', width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : artworks.length > 0 ? (
                        <div className="row g-4">
                            {artworks.map((art) => (
                                <div key={art._id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s" >
                                    <div className="card bg-dark text-light border-secondary h-100 shadow-lg">
                                        <Link to={`/artwork/${art._id}`} className="text-decoration-none">
                                            <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                                                <img className="card-img-top w-100 h-100" src={art.imageUrl} alt={art.title} style={{ objectFit: 'cover' }} />
                                            </div>
                                        </Link>
                                        <div className="card-body d-flex flex-column">
                                            <Link to={`/artwork/${art._id}`} className="text-decoration-none text-light">
                                                <h5 className="card-title text-uppercase">{art.title}</h5>
                                            </Link>
                                            <p className="card-text text-muted small mb-3" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: '2',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>{art.description}</p>
                                            <div className="mt-auto d-flex justify-content-end align-items-center gap-3">
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
                            <p className="fs-4 text-light">No artworks found matching your search.</p>
                        </div>
                    )}
                    
                    <Paginate 
                        pages={pages} 
                        page={page} 
                        renderPageLink={(p) => `/search/${keyword}?page=${p}`} 
                    />
                </div>
            </div>
        </>
    );
};

export default SearchResults;