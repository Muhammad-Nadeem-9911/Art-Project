import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, pageName }) => {
  const [bgImage, setBgImage] = useState('/img/carousel-1.jpg'); // Default image

  useEffect(() => {
    const fetchHeaderImage = async () => {
      if (!pageName) return;
      try {
        const response = await fetch(`/api/content/page/${pageName}`);
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
    <>
      <style>
        {`
          .page-header-responsive {
            background-image: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url(${bgImage});
            min-height: 50vh;
            display: flex;
            align-items: center;
            background-size: cover;
            background-position: center;
            padding-bottom: 3rem;
          }
          @media (max-width: 768px) {
            .page-header-responsive {
              min-height: 35vh;
              padding-bottom: 0;
            }
          }
        `}
      </style>
      <div className={`container-fluid page-header mb-5 page-header-responsive`}>
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
    </>
  );
};

export default PageHeader;