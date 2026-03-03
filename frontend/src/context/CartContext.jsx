import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [shippingAddress, setShippingAddress] = useState(
        JSON.parse(localStorage.getItem('shippingAddress')) || {}
    );
    const [paymentMethod, setPaymentMethod] = useState(
        JSON.parse(localStorage.getItem('paymentMethod')) || 'Cash on Delivery'
    );
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/users/cart', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCart(data);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (paintingId) => {
        if (!user) {
            alert("Please login to add items to cart");
            return;
        }
        try {
            const response = await fetch('/api/users/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ paintingId })
            });
            const data = await response.json();
            if (response.ok) {
                setCart(data);
                alert("Item added to cart!");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const updateQuantity = async (paintingId, quantity) => {
        try {
            const response = await fetch(`/api/users/cart/${paintingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            if (response.ok) {
                setCart(data);
            }
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const removeFromCart = async (paintingId) => {
        try {
            const response = await fetch(`/api/users/cart/${paintingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCart(data);
            }
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch('/api/users/cart', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                setCart([]);
            }
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        localStorage.setItem('shippingAddress', JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        localStorage.setItem('paymentMethod', JSON.stringify(data));
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, shippingAddress, saveShippingAddress, paymentMethod, savePaymentMethod }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;