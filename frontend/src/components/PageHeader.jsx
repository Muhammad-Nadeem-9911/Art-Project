import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, pageName }) => {
  const [bgImage, setBgImage] = useState('/img/carousel-1.jpg'); // Default image

  useEffect(() => {
    const fetchHeaderImage = async () => {
      if (!pageName) return;
      try {
        const response = await fetch(`http://localhost:5000/api/content/page/${pageName}`);
        if (response.ok) {
          const data = await response.json();
          setBgImage(data.heroImageUrl);
        }
      } catch (error) {
        console.error(`Failed to fetch header image for ${pageName}:`, error);
      }
    };

    fetchHeaderImage();
  }, [pageName]);

  return (
    <div
      className="container-fluid page-header mb-5"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url(${bgImage})`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingBottom: '20rem', // Push content up slightly
      }}>
        <div className="container py-5">
            <h1 className="display-3 text-white mb-3 animated slideInDown">{title}</h1>
            <nav aria-label="breadcrumb animated slideInDown">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link className="text-white" to="/">Home</Link></li>
                    <li className="breadcrumb-item text-primary active" aria-current="page">{title}</li>
                </ol>
            </nav>
        </div>
    </div>
  );
};

export default PageHeader;