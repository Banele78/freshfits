import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductBySlug, getReviewByProduct } from "../api/products";
import ProductAccordion from "../components/productDetails/ProductAccordion";
import Sizes from "../components/productDetails/Sizes";
import Reviews from "../components/productDetails/Reviews";
import { ChevronRight } from "lucide-react";
import Images from "../components/productDetails/Images";
import { useCart } from "../context/CartContext";
import ProductDetailLoader from "../components/productDetails/ProductDetailLoader";
import useRequireAuth from "../hooks/useRequireAuth";
import Button from "../components/ui/Button";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, loadingId } = useCart();
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  const { isCartOpen, closeCart, cart, setCart } = useCart();

  const requireAuth = useRequireAuth();

  useEffect(() => {
    if (!isCartOpen) return;

    setQuantity(1);
    setSelectedSize(null);
  }, [closeCart]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch {
        navigate("/products", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug, navigate]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!product) return;

      try {
        const data = await getReviewByProduct(product.id);

        // Replace username with "You" if it's the logged-in user's review
        const formattedReviews = data.map((review) => ({
          ...review,
          userName: review.mine ? "You" : review.userName,
        }));

        setReviews(formattedReviews);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    loadReviews();
  }, [product?.id]);

  // Inside your component
  useEffect(() => {
    // Lock scroll when reviews are open
    if (showReviews) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReviews]);

  if (loading) return <ProductDetailLoader />;
  if (!product) return null;

  const isOutOfStock = product.stockQuantity === 0;

  const selectedSizeObj = product.productsSizes.find(
    (ps) => ps.size === selectedSize,
  );

  const canAddToCart =
    selectedSizeObj && selectedSizeObj.stockQuantity > 0 && quantity > 0;

  const handleAddToCart = () => {
    const allowed = requireAuth({
      // no UI to close here, just redirect if needed
    });

    if (!allowed) return;

    addToCart(product, selectedSizeObj, quantity);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-5 sm:mt-0 lg:mt-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <Images product={product} />

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-1">
            {product.brand} · {product.department}
          </p>
          <p className="text-2xl font-semibold mt-4">
            R{product.price.toFixed(2)}
          </p>
          {isOutOfStock && (
            <p className="mt-2 text-sm text-red-600">Out of stock</p>
          )}

          {/* Sizes */}
          <Sizes
            productsSizes={product.productsSizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
          />

          {/* Add to cart */}
          <Button
            onClick={handleAddToCart}
            loading={loadingId === selectedSizeObj?.id}
            disabled={!canAddToCart}
            fullWidth={true}
            size="md"
            loadingText="Adding..."
            className="mt-6 gap-2 flex items-center justify-center"
          >
            Add to Cart
          </Button>

          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <ProductAccordion product={product} />

          {/* Reviews */}

          {reviews && (
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="
      mt-4 flex items-center justify-between w-full
      text-sm font-medium
      bg-white border border-gray-300 rounded-lg
      px-4 py-6
      text-gray-700
      hover:bg-gray-50 hover:border-gray-400 hover:text-black hover:cursor-pointer
      transition-colors duration-200
    "
            >
              <span>View reviews ({reviews.length})</span>
              <ChevronRight
                className={`w-6 h-6 transition-transform duration-300 ${
                  showReviews ? "rotate-90" : ""
                }`}
                strokeWidth={2.5} // makes the arrow bolder
              />
            </button>
          )}
        </div>
      </div>

      <Reviews
        productId={product.id}
        reviews={reviews}
        setReviews={setReviews}
        setShowReviews={setShowReviews}
        showReviews={showReviews}
      />
    </section>
  );
};

export default ProductDetailPage;
