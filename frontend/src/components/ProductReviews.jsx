import React from 'react';

const ProductReviews = ({ reviews }) => {
    return (
        <div className="mt-5">
            <h3 className="mb-4">Reviews</h3>
            {reviews.length === 0 && <div className="alert alert-secondary">No reviews yet. Be the first!</div>}
            
            <div className="list-group mb-5">
                {reviews.map((review) => (
                    <div key={review._id} className="list-group-item bg-dark text-light border-secondary">
                        <div className="d-flex justify-content-between">
                            <strong>{review.name}</strong>
                            <div className="text-warning">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                            </div>
                        </div>
                        <p className="mt-2 mb-1">{review.comment}</p>
                        <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>

                        {review.adminReply && (
                            <div className="mt-3 p-3 bg-secondary rounded">
                                <strong>Admin Reply:</strong>
                                <p className="mb-1 mt-1">{review.adminReply.text}</p>
                                <small className="text-muted">{new Date(review.adminReply.createdAt).toLocaleDateString()}</small>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;