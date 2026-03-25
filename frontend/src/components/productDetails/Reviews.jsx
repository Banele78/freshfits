import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createReview } from "../../api/products";
import toast from "react-hot-toast";
import useRequireAuth from "../../hooks/useRequireAuth";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Reviews({
  productId, // ✅ needed for submitting
  reviews,
  setReviews,
  showReviews,
  setShowReviews,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [showWriteReview, setShowWriteReview] = useState(false);
  const [loading, setLoading] = useState(false);

  const requireAuth = useRequireAuth();
  const { isAuthenticated } = useAuth();

  // Scroll to bottom when reviews change
  // 1️⃣ Create a ref for the reviews container
  const reviewsContainerRef = useRef(null);

  // 2️⃣ Scroll to top whenever reviews change
  useEffect(() => {
    if (reviewsContainerRef.current) {
      reviewsContainerRef.current.scrollTop = 0;
    }
  }, [reviews]);

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      toast.error("Please ensure rating and comment is filled");
      return;
    }

    if (!isAuthenticated) return;

    setLoading(true);

    try {
      // Check if the user already has a review
      const existingReview = reviews.find((r) => r.mine);

      let savedReview;
      if (existingReview) {
        // Update existing review
        savedReview = await createReview({
          productId,
          rating,
          comment,
        });

        // Move updated review to top
        setReviews((prev) => [
          {
            ...existingReview,
            rating,
            comment,
            updatedAt: new Date().toISOString(),
          },
          ...prev.filter((r) => r.id !== existingReview.id),
        ]);
      } else {
        // Create new review
        savedReview = await createReview({ productId, rating, comment });

        // Optimistic update: new review at top
        const optimisticReview = {
          ...savedReview,
          id: Date.now(),
          updatedAt: new Date().toISOString(),
          userName: "You",
          mine: true,
        };

        setReviews((prev) => [optimisticReview, ...prev]);
      }

      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment("");
      setShowWriteReview(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value) => {
    const totalStars = 5;
    return (
      <>
        {"★".repeat(value)}
        <span className="text-gray-300">{"☆".repeat(totalStars - value)}</span>
      </>
    );
  };

  // Handle back button
  useEffect(() => {
    if (!showReviews) return;
    window.history.pushState({ reviewsOpen: true }, "");

    const handlePopState = () => {
      if (showReviews) {
        setShowReviews(false);
        window.history.pushState({ reviewsOpen: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showReviews, setShowReviews]);

  const handleShowWriteReview = () => {
    const allowed = requireAuth({ redirectTo: "/login" });

    if (!allowed) return; // stop here if not logged in

    setShowWriteReview(true);
  };

  const myReview = reviews?.find((r) => r.mine);

  return (
    <AnimatePresence>
      {showReviews && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setShowReviews(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                aria-label="Close reviews panel"
              >
                <span className="text-lg font-bold">×</span>
              </button>
            </div>

            {/* Reviews list */}
            <div
              ref={reviewsContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {reviews?.map((r) => {
                const reviewDate = new Date(r.updatedAt).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short", year: "numeric" },
                );
                return (
                  <div
                    key={r.id}
                    className="border-b border-gray-200 p-2 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{r.userName}</p>
                      <p className="text-gray-400 text-xs">{reviewDate}</p>
                    </div>
                    <p className="text-yellow-500 text-sm">
                      {renderStars(r.rating)}
                    </p>
                    <p className="mt-2 text-gray-700">{r.comment}</p>
                  </div>
                );
              })}
              <div />
            </div>

            {/* Write review button */}
            <div className="p-3 border-t border-gray-200">
              <Button
                onClick={handleShowWriteReview}
                fullWidth
                size="sm"
                variant="primary"
              >
                {myReview ? "Update your review" : "Write a review"}
              </Button>
            </div>

            {/* Write review modal */}
            <AnimatePresence>
              {showWriteReview && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-50"
                    onClick={() => setShowWriteReview(false)}
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-60 flex items-center justify-center"
                  >
                    <div className="bg-white w-full max-w-sm rounded-lg shadow-xl p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Write a review
                      </h3>

                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className={`text-2xl transition cursor-pointer ${
                              star <= (hoverRating || rating)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts…"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:gray-400"
                        rows={3}
                      />

                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => setShowWriteReview(false)}
                          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-black hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>

                        <Button
                          onClick={handleSubmit}
                          size="sm"
                          variant="primary"
                          loading={loading}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
