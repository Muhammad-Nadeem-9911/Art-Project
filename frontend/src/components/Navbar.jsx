import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const collapseRef = useRef(null);
    
    // Lazy initialize keyword from URL to prevent resetting to empty on reload/navigation
    const [keyword, setKeyword] = useState(() => {
        if (location.pathname.startsWith('/search/')) {
            return decodeURIComponent(location.pathname.split('/search/')[1] || '');
        }
        return '';
    });

    // Sync keyword from URL when location changes (e.g. back button)
    useEffect(() => {
        const urlKeyword = location.pathname.startsWith('/search/') ? decodeURIComponent(location.pathname.split('/search/')[1] || '') : '';
        if (urlKeyword !== keyword && location.pathname.startsWith('/search/')) {
            setKeyword(urlKeyword);
        } else if (!location.pathname.startsWith('/search/') && keyword) {
            setKeyword('');
        }
    }, [location.pathname]);

    const handleLinkClick = () => {
        const navbarCollapse = collapseRef.current;
        // Check if the menu is currently open before trying to close it
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            // Use getOrCreateInstance to safely get the bootstrap collapse instance and hide it.
            // This is safer than creating a new instance every time, which was causing the first click to fail.
            const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            // bsCollapse might be null if the element is not yet fully initialized, so we check.
            if (bsCollapse) bsCollapse.hide();
        }
    };

    const handleLogout = () => {
        logout();
        // Ensure menu closes on logout as well
        handleLinkClick();
        navigate('/login');
    };

    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    const gradientButtonStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)',
        border: 'none',
        color: 'white'
    };

    const cartItemCount = cart ? cart.length : 0;

    useEffect(() => {
        const handler = setTimeout(() => {
            if (keyword.trim()) {
                const targetPath = `/search/${keyword}`;
                // Only navigate if the path is different
                if (location.pathname !== targetPath) {
                    navigate(targetPath);
                }
            } else if (keyword === '' && location.pathname.startsWith('/search/')) { 
                // Only navigate home if keyword is explicitly empty AND we are on a search page
                navigate('/');
            }
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        }
    }, [keyword]); // Remove location.pathname from deps to prevent loops

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-lg-5 sticky-top shadow-sm">
            <style>
                {`
                    .navbar-dark .navbar-nav .nav-link:hover {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: transparent !important;
                    }
                    .form-control-dark {
                        background-color: #212529;
                        border-color: #495057;
                        color: #fff;
                    }
                    .form-control-dark:focus {
                        background-color: #212529;
                        border-color: #00BCF2;
                        color: #fff;
                        box-shadow: 0 0 0 0.25rem rgba(0, 188, 242, 0.25);
                    }
                    .form-control-dark::placeholder {
                        color: #6c757d;
                    }
                    .btn-search {
                        border-color: #495057;
                        color: #00BCF2;
                        background-color: #212529;
                    }
                    .btn-search:hover {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        color: white;
                        border-color: transparent;
                    }
                    
                    /* Navbar Toggler Customization */
                    .navbar-toggler {
                        border: none;
                        padding: 0.5rem;
                    }
                    .navbar-toggler:focus {
                        box-shadow: none;
                        outline: 2px solid #00BCF2;
                    }

                    @media (max-width: 991.98px) {
                        .navbar-collapse {
                            background: rgba(33, 37, 41, 0.98); /* Dark background with slight transparency */
                            backdrop-filter: blur(10px); /* Blur effect */
                            border-top: 1px solid rgba(255, 255, 255, 0.1);
                            padding: 1.5rem;
                            margin-top: 0.5rem;
                            border-radius: 0 0 1rem 1rem;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                        }
                        
                        .navbar-nav {
                            text-align: center;
                            gap: 0.5rem;
                            margin-bottom: 1.5rem;
                        }

                        .navbar-nav .nav-link {
                            padding: 0.8rem 1rem;
                            border-radius: 0.5rem;
                            transition: all 0.3s ease;
                            font-size: 1.1rem;
                            letter-spacing: 1px;
                            border: 1px solid transparent;
                        }

                        .navbar-nav .nav-link:hover, 
                        .navbar-nav .nav-link.active {
                            background: rgba(255, 255, 255, 0.05);
                            border-color: rgba(255, 255, 255, 0.1);
                        }

                        .mobile-actions-wrapper {
                            display: flex;
                            flex-direction: column;
                            gap: 1.5rem;
                        }

                        .mobile-actions-wrapper form {
                            width: 100%;
                            margin: 0 !important;
                        }

                        .mobile-actions-wrapper .input-group {
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        }

                        /* User Actions Container */
                        .mobile-actions-wrapper > div:last-child {
                            justify-content: center !important;
                            gap: 2rem;
                            padding-top: 1.5rem;
                            border-top: 1px solid rgba(255, 255, 255, 0.1);
                            width: 100%;
                        }
                        
                        .dropdown-menu {
                            text-align: center;
                            background-color: rgba(0,0,0,0.5);
                            border: 1px solid rgba(255,255,255,0.1);
                        }
                    }
                `}
            </style>
            <Link to="/" className="navbar-brand ms-4 ms-lg-0">
                <h2 className="mb-0 text-uppercase fw-bold" style={{ ...gradientTextStyle, letterSpacing: '2px' }}>Iram Ali</h2>
            </Link>
            <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse" ref={collapseRef}>
                <div className="navbar-nav mx-auto p-4 p-lg-0">
                    <NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}} end>Home</NavLink>
                    <NavLink to="/about" onClick={handleLinkClick} className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}}>About</NavLink>
                    <NavLink to="/services" onClick={handleLinkClick} className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}}>Services</NavLink>
                    <NavLink to="/contact" onClick={handleLinkClick} className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}}>Contact</NavLink>
                </div>
                <div className="d-lg-flex align-items-center ms-lg-auto mobile-actions-wrapper">
                    <form className="d-flex w-100 w-lg-auto me-lg-4 mb-3 mb-lg-0" onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group">
                            <input type="text" className="form-control form-control-dark" placeholder="Search..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                            <button className="btn btn-search" type="button"><i className="fas fa-search"></i></button>
                        </div>
                    </form>
                    <div className="d-flex align-items-center justify-content-between w-100 w-lg-auto">
                        {user && (
                            <Link to="/cart" onClick={handleLinkClick} className="nav-item nav-link position-relative text-white p-0">
                                <i className="fas fa-shopping-cart fa-lg"></i>
                                {cartItemCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>{cartItemCount}</span>
                                )}
                            </Link>
                        )}
                        {user ? (
                            <div className="nav-item dropdown ms-3">
                                <a href="#" className="nav-link dropdown-toggle text-white" data-bs-toggle="dropdown">{user.name}</a>
                                <div className="dropdown-menu dropdown-menu-dark dropdown-menu-end rounded-0 m-0">
                                    <Link to="/wishlist" onClick={handleLinkClick} className="dropdown-item">Wishlist</Link>
                                    <Link to="/profile" onClick={handleLinkClick} className="dropdown-item">Profile</Link>
                                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" onClick={handleLinkClick} className="btn ms-auto" style={gradientButtonStyle}>Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;