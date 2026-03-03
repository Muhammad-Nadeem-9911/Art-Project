import React, { useContext } from 'react';
import CartContext from '../context/CartContext';

const AddToCart = ({ paintingId }) => {
    const { addToCart } = useContext(CartContext);

    const gradientButtonStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)',
        border: 'none',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
    };

    return (
        <button onClick={() => addToCart(paintingId)} style={gradientButtonStyle} className="btn" title="Add to Cart">
            <i className="fas fa-shopping-cart"></i>
        </button>
    );
};

export default AddToCart;