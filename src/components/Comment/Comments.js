import { useState, useEffect } from "react";
import { FaStar, FaUser, FaTimes } from "react-icons/fa";
import ReactDOM from "react-dom";
import {
  getReviews,
  submitReview,
  markReviewHelpful,
} from "../../services/shopifyService";

import "../Comment/Comments.css";

export default function Comments({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 0,
    location: "",
  });

  const [showAddReview, setShowAddReview] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [modalRoot, setModalRoot] = useState(null);

  // Set up modal root once
  useEffect(() => {
    setModalRoot(document.body);
  }, []);

  // Fetch reviews from backend using shopifyService
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Product ID being used:", productId);

      const data = await getReviews(productId, page, 10, "-createdAt");

      setReviews(data.reviews);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`star ${index < rating ? "filled" : "empty"} ${
          interactive ? "interactive" : ""
        }`}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
        style={{
          color: index < rating ? "#ffd700" : "#ddd",
          cursor: interactive ? "pointer" : "default",
          fontSize: interactive ? "24px" : "16px",
          transition: "color 0.2s ease",
        }}
      />
    ));
  };

  const handleAddReview = async () => {
    if (
      newReview.name.trim() &&
      newReview.comment.trim() &&
      newReview.rating > 0
    ) {
      try {
        setSubmitting(true);
        setError(null);

        const submittedReview = await submitReview(productId, {
          name: newReview.name.trim(),
          email: newReview.email.trim(),
          location: newReview.location.trim(),
          rating: newReview.rating,
          comment: newReview.comment.trim(),
        });

        // Add the new review to the beginning of the list
        setReviews([submittedReview, ...reviews]);

        // Update stats
        setStats((prev) => {
          const newTotalReviews = prev.totalReviews + 1;
          const newAverageRating =
            (prev.averageRating * prev.totalReviews + newReview.rating) /
            newTotalReviews;

          return {
            ...prev,
            totalReviews: newTotalReviews,
            averageRating: newAverageRating,
            ratingDistribution: {
              ...prev.ratingDistribution,
              [newReview.rating]:
                (prev.ratingDistribution[newReview.rating] || 0) + 1,
            },
          };
        });

        // Reset form and close modal
        setNewReview({
          name: "",
          email: "",
          comment: "",
          rating: 0,
          location: "",
        });
        setShowAddReview(false);

        // Show success message
        console.log("Review submitted successfully!");
      } catch (err) {
        console.error("Error submitting review:", err);
        setError(err.message);
        alert(`Error submitting review: ${err.message}`);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const closeModal = () => {
    setShowAddReview(false);
    setNewReview({ name: "", email: "", comment: "", rating: 0, location: "" });
  };

  const handleSeeMore = () => {
    setVisibleReviews((prev) => prev + 3);
  };

  const handleSeeLess = () => {
    setVisibleReviews(3);
  };

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const data = await getReviews(
        productId,
        pagination.currentPage + 1,
        10,
        "-createdAt"
      );

      // Append new reviews to existing ones
      setReviews([...reviews, ...data.reviews]);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error loading more reviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && reviews.length === 0) {
    return (
      <div className="comments-wrapper">
        <div className="comments-container">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && reviews.length === 0) {
    return (
      <div className="comments-wrapper">
        <div className="comments-container">
          <div className="error-message">
            <p>Error loading reviews: {error}</p>
            <button onClick={() => fetchReviews()} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No product ID provided
  if (!productId) {
    return (
      <div className="comments-wrapper">
        <div className="comments-container">
          <p>No product ID provided</p>
        </div>
      </div>
    );
  }

  // Create modal content
  const modalContent = (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Write Your Review</h3>
          <button className="close-modal-btn" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="review-input"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              placeholder="your@email.com (optional)"
              value={newReview.email}
              onChange={(e) =>
                setNewReview({ ...newReview, email: e.target.value })
              }
              className="review-input"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Your Location</label>
            <input
              type="text"
              placeholder="City, Country (optional)"
              value={newReview.location}
              onChange={(e) =>
                setNewReview({ ...newReview, location: e.target.value })
              }
              className="review-input"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Your Rating *</label>
            <div className="star-rating">
              {renderStars(newReview.rating, true, (rating) =>
                setNewReview({ ...newReview, rating })
              )}
              <span className="rating-text">
                {newReview.rating > 0 &&
                  `(${newReview.rating} star${
                    newReview.rating > 1 ? "s" : ""
                  })`}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Your Review *</label>
            <textarea
              placeholder="Share your experience with this product..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="review-textarea"
              rows="4"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={closeModal}
            className="cancel-btn"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleAddReview}
            className="submit-review-btn"
            disabled={
              !newReview.name.trim() ||
              !newReview.comment.trim() ||
              newReview.rating === 0 ||
              submitting
            }
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="comments-wrapper">
      <div className="comments-container">
        <h1>Product Reviews</h1>

        {/* Rating Summary */}
        <div className="rating-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <div className="rating-display">
                <FaStar style={{ color: "#ffd700", fontSize: "24px" }} />
                <h2>
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                </h2>
              </div>
              <p>{stats.totalReviews || 0} Reviews</p>
            </div>

            <button
              className="add-review-btn"
              onClick={() => setShowAddReview(true)}
            >
              Write a Review
            </button>
          </div>
        </div>

        <hr />

        {/* Modal rendered through portal */}
        {showAddReview &&
          modalRoot &&
          ReactDOM.createPortal(modalContent, modalRoot)}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div key={review._id || review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="avatar">
                      <FaUser />
                    </div>
                    <div className="reviewer-details">
                      <h4>{review.name}</h4>
                      {review.location && (
                        <p className="location">{review.location}</p>
                      )}
                      <p className="review-date">
                        {review.formattedDate || review.date}
                      </p>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className="review-content">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* See More / See Less Button */}
        {reviews.length > 3 && (
          <div className="see-more-container">
            {visibleReviews < reviews.length ? (
              <button onClick={handleSeeMore} className="see-more-btn">
                See More Reviews ({reviews.length - visibleReviews} more)
              </button>
            ) : (
              <button onClick={handleSeeLess} className="see-more-btn">
                See Less
              </button>
            )}
          </div>
        )}

        {/* Load More from Server */}
        {pagination.hasMore && visibleReviews >= reviews.length && (
          <div className="load-more-container">
            <button
              onClick={handleLoadMore}
              className="load-more-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More Reviews"}
            </button>
          </div>
        )}

        {/* Error display for non-critical errors */}
        {error && reviews.length > 0 && (
          <div className="error-banner">
            <p>Error: {error}</p>
            <button onClick={() => setError(null)} className="dismiss-btn">
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
