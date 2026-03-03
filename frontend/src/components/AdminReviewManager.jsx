import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminReviewManager = ({ showToast }) => {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchPaintingsWithReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/paintings`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPaintings(data.filter(p => p.reviews && p.reviews.length > 0));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPaintingsWithReviews();
        }
    }, [user]);

    const handleOpenReplyModal = (review) => {
        setCurrentReview(review);
        setReplyText(review.adminReply?.text || '');
        setShowReplyModal(true);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!currentReview || !replyText) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/paintings/${currentReview.paintingId}/${currentReview._id}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ text: replyText })
            });

            if (res.ok) {
                showToast('Reply submitted successfully');
                setShowReplyModal(false);
                fetchPaintingsWithReviews(); // Refresh data
            } else {
                showToast('Failed to submit reply', 'error');
            }
        } catch (err) {
            showToast('Server error submitting reply', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const allReviews = paintings.flatMap(p => 
        p.reviews.map(r => ({ ...r, paintingId: p._id, paintingTitle: p.title }))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <>
            {/* Reply Modal */}
            {showReplyModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1055 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <form onSubmit={handleReplySubmit} className="modal-content bg-dark text-light border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">Reply to Review</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowReplyModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Artwork:</strong> {currentReview?.paintingTitle}</p>
                                <p><strong>User:</strong> {currentReview?.name}</p>
                                <blockquote className="blockquote-footer bg-secondary p-2 rounded">{currentReview?.comment}</blockquote>
                                <div className="mb-3">
                                    <label htmlFor="replyText" className="form-label">Your Reply</label>
                                    <textarea
                                        id="replyText"
                                        className="form-control bg-dark text-light border-secondary"
                                        rows="4"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowReplyModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Submit Reply'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="p-4">
                <h3>Manage Reviews</h3>
                {loading ? (
                    <p>Loading reviews...</p>
                ) : (
                    <div className="list-group">
                        {allReviews.length > 0 ? allReviews.map(review => (
                            <div key={review._id} className="list-group-item bg-dark text-light border-secondary mb-3">
                                <div className="d-flex w-100 justify-content-between flex-column flex-sm-row">
                                    <h5 className="mb-1">{review.paintingTitle}</h5>
                                    <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                                </div>
                                <p className="mb-1"><strong>{review.name}</strong> ({'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)})</p>
                                <p className="mb-1">{review.comment}</p>
                                {review.adminReply ? (
                                    <div className="mt-2 p-2 bg-secondary rounded">
                                        <p className="mb-0"><strong>Your Reply:</strong> {review.adminReply.text}</p>
                                        <button className="btn btn-sm btn-outline-light mt-2" onClick={() => handleOpenReplyModal(review)}>Edit Reply</button>
                                    </div>
                                ) : (
                                    <button className="btn btn-sm btn-primary mt-2" onClick={() => handleOpenReplyModal(review)}>Reply</button>
                                )}
                            </div>
                        )) : <p>No reviews found.</p>}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminReviewManager;