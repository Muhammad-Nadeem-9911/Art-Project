import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onFileSelect, initialImageUrl = '', multiple = false }) => {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (Array.isArray(initialImageUrl)) {
            setPreviews(initialImageUrl);
        } else if (initialImageUrl) {
            setPreviews([initialImageUrl]);
        } else {
            setPreviews([]);
        }
    }, [initialImageUrl]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            onFileSelect(multiple ? [] : null);
            return;
        }

        if (multiple) {
            const fileList = Array.from(files);
            const newPreviews = fileList.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
            onFileSelect(fileList);
            
            // Cleanup memory when component unmounts or file changes
            return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
        } else {
            const file = files[0];
            const objectUrl = URL.createObjectURL(file);
            setPreviews([objectUrl]);
            onFileSelect(file);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    return (
        <div>
            <input
                type="file"
                className="form-control bg-dark text-white border-0"
                onChange={handleFileChange}
                accept="image/*"
                multiple={multiple}
            />
            {previews.length > 0 && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                    {previews.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Preview ${index}`}
                            className="img-fluid rounded"
                            style={{ maxHeight: '150px', maxWidth: '150px', objectFit: 'cover' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;