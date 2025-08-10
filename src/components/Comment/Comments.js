import { useState } from "react";
import { FaStar, FaUser, FaTimes } from "react-icons/fa";
import "../Comment/Comments.css";
export default function Comments() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Adithya GV",
      comment: "One of the amazing bars that I have ever had!!",
      rating: 4,
      date: "2 days ago",
      location: "Chennai, India",
    },
    {
      id: 2,
      name: "Priya Sharma",
      comment:
        "Love these protein bars! Great taste and very filling. Perfect for my morning workout routine.",
      rating: 5,
      date: "1 week ago",
      location: "Mumbai, India",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      comment:
        "Good quality ingredients and healthy option. Slightly expensive but worth it for the nutritional value.",
      rating: 4,
      date: "2 weeks ago",
      location: "Bangalore, India",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
    location: "",
  });

  const [showAddReview, setShowAddReview] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3); // Show 3 reviews initially

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

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

  const handleAddReview = () => {
    if (
      newReview.name.trim() &&
      newReview.comment.trim() &&
      newReview.rating > 0
    ) {
      const review = {
        id: reviews.length + 1,
        ...newReview,
        date: "Just now",
      };
      setReviews([review, ...reviews]);
      setNewReview({ name: "", comment: "", rating: 0, location: "" });
      setShowAddReview(false);
    }
  };

  const closeModal = () => {
    setShowAddReview(false);
    setNewReview({ name: "", comment: "", rating: 0, location: "" }); // Reset form when closing
  };

  const handleSeeMore = () => {
    setVisibleReviews((prev) => prev + 3); // Show 3 more reviews
  };

  const handleSeeLess = () => {
    setVisibleReviews(3); // Reset to initial 3 reviews
  };

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
                <h2>{averageRating.toFixed(1)}</h2>
              </div>
              <p>{reviews.length} Reviews</p>
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

        {/* Modal Overlay */}
        {showAddReview && (
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
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  className="submit-review-btn"
                  disabled={
                    !newReview.name.trim() ||
                    !newReview.comment.trim() ||
                    newReview.rating === 0
                  }
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.slice(0, visibleReviews).map((review) => (
            <div key={review.id} className="review-card">
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
                    <p className="review-date">{review.date}</p>
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
      </div>
    </div>
  );
}
