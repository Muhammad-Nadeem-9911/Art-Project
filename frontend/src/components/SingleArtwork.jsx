import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import ProductReviews from './ProductReviews';
import Toast from './Toast';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const SingleArtwork = () => {
    const { artworkId } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [relatedArtworks, setRelatedArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { cart, addToCart } = useContext(CartContext);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const spinner = document.getElementById('spinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
    }, []);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const fetchArtwork = async () => {
        try {
            const response = await fetch(`/api/paintings/${artworkId}`);
            if (response.ok) {
                const data = await response.json();
                setArtwork(data);
                
                // Fetch related artworks based on category
                if (data.category) {
                    const categoryId = data.category._id || data.category;
                    const relatedRes = await fetch(`/api/paintings/category/${categoryId}`);
                    if (relatedRes.ok) {
                        const relatedData = await relatedRes.json();
                        setRelatedArtworks(relatedData.paintings.filter(p => p._id !== data._id).slice(0, 4));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch artwork:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtwork();
    }, [artworkId]);

    // Check Wishlist Status
    useEffect(() => {
        const checkWishlist = async () => {
            if (user && artwork) {
                try {
                    const res = await fetch(`/api/users/wishlist`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const found = data.find(p => p._id === artwork._id);
                        setIsInWishlist(!!found);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        checkWishlist();
    }, [user, artwork]);

    const handleWishlistToggle = async () => {
        if (!user) {
            alert("Please login to manage wishlist");
            return;
        }
        setWishlistLoading(true);
        try {
            const method = isInWishlist ? 'DELETE' : 'POST';
            const url = isInWishlist 
                ? `/api/users/wishlist/${artwork._id}` 
                : `/api/users/wishlist`;
            
            const body = isInWishlist ? {} : { paintingId: artwork._id };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: isInWishlist ? null : JSON.stringify(body)
            });

            if (res.ok) {
                setIsInWishlist(!isInWishlist);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWishlistLoading(false);
        }
    };

    // Cart Logic
    const isInCart = artwork && cart ? cart.some(item => {
        const p = item.painting || item.product || item;
        const pId = p && typeof p === 'object' ? p._id : p;
        return String(pId) === String(artwork._id);
    }) : false;

    const handleAddToCart = () => {
        if (isInCart) {
            navigate('/cart');
            return;
        }

        if (!user) {
            showToast('Please login to add to cart', 'error');
            return;
        }

        // Suppress default alert from CartContext to use custom Toast
        const originalAlert = window.alert;
        window.alert = () => {};

        addToCart(artwork._id);
        showToast('Added to cart successfully');

        // Restore alert after a delay to ensure async alerts are suppressed
        setTimeout(() => {
            window.alert = originalAlert;
        }, 1000);
    };

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
                <PageHeader title="Not Found" />
                <div className="container py-5 text-center">
                    <h2>Artwork not found.</h2>
                </div>
            </>
        );
    }

    const imageList = artwork.images && artwork.images.length > 0 ? artwork.images : [artwork.imageUrl];

    return (
        <>
            {/* Toast Container */}
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
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
            <PageHeader title={artwork.title} pageName="artwork" />
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
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
                        <div className="col-lg-6 ps-lg-5">
                            <h1 className="display-4 fw-bold text-uppercase mb-2">{artwork.title}</h1>
                            
                            {/* Category */}
                            <div className="mb-3">
                                <span className="badge rounded-pill px-3 py-2" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)' }}>{artwork.category?.title || 'Uncategorized'}</span>
                            </div>
                            
                            {/* Rating Stars */}
                            <div className="mb-3 text-warning d-flex align-items-center">
                                <div className="me-2">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={
                                            artwork.rating >= i + 1 ? 'fas fa-star' : 
                                            artwork.rating >= i + 0.5 ? 'fas fa-star-half-alt' : 
                                            'far fa-star'
                                        }></i>
                                    ))}
                                </div>
                                <small className="text-muted">({artwork.numReviews} Reviews)</small>
                            </div>

                            {/* Price and Stock */}
                            <h2 className="display-6 fw-bold mb-3" style={{ color: '#00BCF2' }}>${artwork.price.toFixed(2)}</h2>
                            <div className="mb-4">
                                <span className={`badge ${artwork.countInStock > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                                    {artwork.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="d-flex align-items-center gap-4 mt-4">
                                {artwork.countInStock > 0 && (
                                    <button 
                                        className={`btn ${isInCart ? 'btn-success' : 'btn-primary'} px-4 py-2 text-uppercase fw-bold`}
                                        onClick={handleAddToCart}
                                        style={!isInCart ? { background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', border: 'none' } : {}}
                                    >
                                        <i className={`fas ${isInCart ? 'fa-check' : 'fa-shopping-cart'} me-2`}></i>
                                        {isInCart ? 'Already in Cart' : 'Add to Cart'}
                                    </button>
                                )}
                                <button 
                                    className={`btn ${isInWishlist ? 'btn-outline-danger' : 'btn-outline-light'} px-4 py-2 text-uppercase fw-bold`}
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                >
                                    <i className={`fas ${isInWishlist ? 'fa-heart' : 'fa-heart'} me-2`}></i>
                                    {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="p-4 bg-dark rounded border border-secondary shadow-sm">
                                <h3 className="text-uppercase mb-4" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Description</h3>
                                <p className="fs-5 text-light" style={{ lineHeight: '1.8' }}>{artwork.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <ProductReviews 
                        productId={artwork._id} 
                        reviews={artwork.reviews || []} 
                    />
                </div>

                {/* Related Artworks Section */}
                {relatedArtworks.length > 0 && (
                    <div className="container mt-5">
                        <h3 className="text-uppercase mb-4" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Related Artworks</h3>
                        <div className="row g-4">
                            {relatedArtworks.map((art) => (
                                <div key={art._id} className="col-lg-3 col-md-6">
                                    <div className="card bg-light border-0 h-100 shadow-sm">
                                        <Link to={`/artwork/${art._id}`} className="text-decoration-none">
                                            <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                                                <img className="card-img-top w-100 h-100" src={art.imageUrl} alt={art.title} style={{ objectFit: 'cover' }} />
                                            </div>
                                        </Link>
                                        <div className="card-body d-flex flex-column">
                                            <Link to={`/artwork/${art._id}`} className="text-decoration-none text-dark">
                                                <h5 className="card-title text-uppercase">{art.title}</h5>
                                            </Link>
                                            <p className="card-text text-muted small mb-3" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: '2',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>{art.description}</p>
                                            <div className="mt-auto d-flex justify-content-end align-items-center gap-2">
                                                <Link to={`/artwork/${art._id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SingleArtwork;
