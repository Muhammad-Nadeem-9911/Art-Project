import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, renderPageLink }) => {
    if (pages <= 1) return null;

    return (
        <nav className="mt-5">
            <ul className="pagination justify-content-center">
                {[...Array(pages).keys()].map((x) => (
                    <li 
                        className={`page-item ${x + 1 === page ? 'active' : ''}`} 
                        key={x + 1}
                    >
                        <Link 
                            className="page-link" 
                            to={renderPageLink(x + 1)}
                            style={x + 1 === page ? {
                                background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
                                borderColor: 'transparent',
                                color: 'white'
                            } : {
                                backgroundColor: '#212529',
                                borderColor: '#495057',
                                color: '#fff'
                            }}
                        >
                            {x + 1}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Paginate;