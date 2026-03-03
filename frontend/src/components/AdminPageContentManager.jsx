import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

const pages = ['about', 'contact', 'services', 'artwork'];

const AdminPageContentManager = ({ showToast }) => {
    const [contentData, setContentData] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [savingPage, setSavingPage] = useState(null);

    useEffect(() => {
        const fetchAllContent = async () => {
            try {
                const res = await fetch(`/api/admin/page-content`);
                if (res.ok) {
                    const data = await res.json();
                    // Convert array to object keyed by pageName: { about: { ... }, contact: { ... } }
                    const dataMap = {};
                    data.forEach(item => {
                        dataMap[item.pageName] = item;
                    });
                    setContentData(dataMap);
                }
            } catch (err) {
                console.error("Failed to fetch page content:", err);
            }
        };
        fetchAllContent();
    }, []);

    const handleSave = async (pageName) => {
        setSavingPage(pageName);
        const file = selectedFiles[pageName];
        let currentImageUrl = contentData[pageName]?.heroImageUrl || '';
        const oldImage = currentImageUrl;

        try {
            // 1. Upload Image if a new file is selected
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                
                const uploadRes = await fetch(`/api/admin/upload`, {
                    method: 'POST',
                    body: formData,
                });
                
                if (!uploadRes.ok) throw new Error('Image upload failed');
                
                const uploadData = await uploadRes.json();
                currentImageUrl = uploadData.imageUrl;
            }

            // 2. Save/Update Page Content
            const response = await fetch(`/api/admin/page-content`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }, // Include old image URL for deletion on backend
                body: JSON.stringify({ 
                    pageName, 
                    heroImageUrl: currentImageUrl, 
                    oldImage: file ? oldImage : null // Only delete old if we uploaded a new one
                })
            });

            if (response.ok) {
                const updatedContent = await response.json();
                setContentData(prev => ({ ...prev, [pageName]: updatedContent }));
                setSelectedFiles(prev => {
                    const newState = { ...prev };
                    delete newState[pageName];
                    return newState;
                });
                showToast(`Saved ${pageName} header!`);
            } else {
                throw new Error('Failed to save content');
            }
        } catch (err) {
            console.error(err);
            showToast('Error saving content', 'error');
        } finally {
            setSavingPage(null);
        }
    };

    return (
        <div className="bg-secondary p-4 rounded">
            <style>
                {`
                    /* Override pink color for admin tabs, titles, and text */
                    .nav-tabs .nav-link.active,
                    .text-primary {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .nav-tabs .nav-link.active {
                        border-color: #dee2e6 #dee2e6 #fff; /* Adjust border for active tab */
                    }
                    .nav-tabs .nav-link:not(.active) {
                        color: white;
                    }
                    /* Override pink buttons */
                    .btn-primary {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759) !important;
                        border: none !important;
                        box-shadow: 0 0 15px rgba(0, 188, 242, 0.5);
                    }
                `}
            </style>
            <h3 className="text-white mb-4">Page Headers (Hero Images)</h3>
            <div className="row g-3">
                {pages.map(page => (
                    <div key={page} className="col-12 col-md-6 col-lg-4">
                        <div className="bg-dark p-3 rounded">
                            <label className="text-white text-capitalize mb-2">{page} Page Header</label>
                            <ImageUpload 
                                onFileSelect={(file) => setSelectedFiles({...selectedFiles, [page]: file})}
                                initialImageUrl={contentData[page]?.heroImageUrl || ''}
                            />
                            <button 
                                onClick={() => handleSave(page)} 
                                className="btn text-white w-100 mt-3" 
                                style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }}
                                disabled={savingPage === page}
                            >
                                {savingPage === page ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPageContentManager;
