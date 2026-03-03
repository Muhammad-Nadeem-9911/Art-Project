import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on page load
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Add a check to ensure the token exists to prevent errors with malformed stored data
                if (parsedUser && parsedUser.token) {
                    setUser(parsedUser);
                } else {
                    // If malformed, clear it
                    localStorage.removeItem('userInfo');
                    setUser(null);
                }
            } catch (error) {
                // If parsing fails, clear it
                localStorage.removeItem('userInfo');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    };

    const register = async (name, email, password) => {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();

        if (response.ok) {
            // Don't log in user automatically, just return success data
            return data;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;