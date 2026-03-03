import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const AddToWishlist = ({ paintingId }) => {
    const { user } = useContext(AuthContext);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && paintingId) {
            checkWishlistStatus();
        }
    }, [user, paintingId]);

    const checkWishlistStatus = async () => {
        try {
            const res = await fetch('/api/users/wishlist', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            // Check if the current painting is in the returned wishlist array
            const found = data.find(p => p._id === paintingId);
            setIsInWishlist(!!found);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleWishlist = async () => {
        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }
        setLoading(true);
        try {
            const method = isInWishlist ? 'DELETE' : 'POST';
            const url = isInWishlist 
                ? `/api/users/wishlist/${paintingId}` 
                : '/api/users/wishlist';
            
            const body = isInWishlist ? {} : { paintingId };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: isInWishlist ? null : JSON.stringify(body)
            });

            if (res.ok) {
                setIsInWishlist(!isInWishlist);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={toggleWishlist} 
            className={`btn ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'} rounded-circle`}
            style={{ width: '40px', height: '40px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
            disabled={loading}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fas fa-heart"></i>}
        </button>
    );
};

export default AddToWishlist;