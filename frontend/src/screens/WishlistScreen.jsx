import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const WishlistScreen = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) return;
            try {
                const response = await fetch('/api/users/wishlist', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch wishlist');
                setWishlist(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    const removeFromWishlist = async (paintingId) => {
        try {
            const response = await fetch(`/api/users/wishlist/${paintingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                setWishlist(wishlist.filter(item => item._id !== paintingId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#121212', paddingTop: '80px' }}>
                <div className="spinner-border" role="status" style={{ color: '#00BCF2' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container-fluid bg-dark pb-5 text-center text-light" style={{ minHeight: '100vh', paddingTop: '120px' }}>
                <h2 className="text-danger">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-dark pb-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <style>
                {`
                    .icon-btn {
                        background: none;
                        border: none;
                        color: #adb5bd;
                        transition: color 0.2s ease-in-out;
                    }
                    .icon-btn.view-btn:hover {
                        color: #00BCF2;
                    }
                    .icon-btn.remove-btn:hover {
                        color: #dc3545;
                    }
                    .gradient-link {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-decoration: none;
                        font-weight: bold;
                    }
                `}
            </style>
            <div className="container">
                <h2 className="mb-5 text-center fw-bold text-uppercase" style={gradientTextStyle}>My Wishlist</h2>
                {wishlist.length === 0 ? (
                    <div className="text-center text-light">
                        <p className="fs-4">Your wishlist is empty.</p>
                        <Link to="/" className="gradient-link fs-5">Explore Artworks</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {wishlist.map((painting) => (
                            <div key={painting._id} className="col-md-6 col-lg-4">
                                <div className="card bg-dark text-light border-secondary h-100 shadow-lg">
                                    <Link to={`/artwork/${painting._id}`}>
                                        <img 
                                            src={painting.imageUrl || (painting.images && painting.images[0])} 
                                            className="card-img-top" 
                                            alt={painting.title}
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                    </Link>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-uppercase">{painting.title}</h5>
                                        <p className="card-text text-muted small">{painting.category?.title || 'Uncategorized'}</p>
                                        <div className="mt-auto d-flex justify-content-end align-items-center gap-3">
                                            <Link to={`/artwork/${painting._id}`} className="icon-btn view-btn" title="View Details">
                                                <i className="fas fa-eye fa-lg"></i>
                                            </Link>
                                            <button 
                                                onClick={() => removeFromWishlist(painting._id)} 
                                                className="icon-btn remove-btn"
                                                title="Remove from Wishlist"
                                            >
                                                <i className="fas fa-trash-alt fa-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistScreen;