import { useEffect, useState } from "react";
import { getUserOrderByOrderNumber } from "../../../api/order";
import Button from "../../ui/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderProgressTracker from "./OrderProgressTracker";
import { ArrowLeft, Download, AlertCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const { orderNumber } = useParams();
  const DOWNLOADABLE_STATUSES = ["PAID", "SHIPPED", "DELIVERED"];

  useEffect(() => {
    if (!orderNumber) return;
    if (!isAuthenticated) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserOrderByOrderNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        setError("Failed to fetch order.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, isAuthenticated]);

  const canDownloadInvoice = (status) => DOWNLOADABLE_STATUSES.includes(status);

  const downloadInvoice = (id) => {
    console.log("Download invoice for order:", id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border border-neutral-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!order) {
    return <p className="text-sm text-neutral-400">Order not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <button
          onClick={() => navigate("/account/orders")}
          className="flex mb-1 items-center gap-1 text-sm cursor-pointer text-neutral-500 hover:text-black transition w-fit group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Orders
        </button>

        <h2 className="text-lg uppercase tracking-widest font-medium">
          Order {order.orderNumber}
        </h2>

        <p className="text-sm text-neutral-500">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Order Status Badge */}
        {!["PAID", "SHIPPED", "DELIVERED"].includes(order.status) && (
          <span
            className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
              order.status === "PAID"
                ? "bg-green-100 text-green-800"
                : order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "DELIVERED"
                    ? "bg-gray-100 text-gray-800"
                    : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
            }`}
          >
            {order.status}
          </span>
        )}
      </div>

      {order.status === "PENDING" && order.yocoCheckoutUrl && (
        <div className="flex flex-col gap-2 mt-2">
          <Button onClick={() => window.open(order.yocoCheckoutUrl, "_blank")}>
            Pay Now
          </Button>
        </div>
      )}

      <OrderProgressTracker status={order.status} />

      {/* Products */}
      <div className="divide-y divide-neutral-200">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-start  p-4 gap-4">
            {/* Image */}
            <Link to={`/products/${item.slug}`}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded flex-shrink-0"
              />
            </Link>

            {/* Content */}
            <div className="flex-1">
              <div className="space-y-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-500">Size: {item.size}</p>
                <p className="text-sm text-neutral-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              {/* Price Section */}
              <div className="mt-3 sm:mt-0 sm:ml-auto sm:text-right">
                <p className="text-sm text-neutral-700">
                  Price: R{item.price.toFixed(2)}
                </p>
                <p className="text-sm text-neutral-700 font-medium">
                  Subtotal: R{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="mt-4 text-sm text-neutral-500 border-t pt-2 space-y-1">
        <p className="font-semibold">Shipping Address:</p>
        <p>
          {order.shippingAddress.name} {order.shippingAddress.surname} (
          {order.shippingAddress.addressType})
        </p>
        <p>
          {order.shippingAddress.addressLine1}
          {order.shippingAddress.addressLine2 &&
            `, ${order.shippingAddress.addressLine2}`}
        </p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.province}
        </p>
        <p>
          {order.shippingAddress.country} {order.shippingAddress.postalCode}
        </p>
        <p>Phone: {order.shippingAddress.phoneNo}</p>
      </div>

      {/* Pricing & Actions */}
      <div className="w-full md:w-auto flex flex-col gap-2 text-sm text-neutral-700">
        <div className="flex justify-between border-t pt-2">
          <span>Subtotal</span>
          <span>R{order.subtotalAmount?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>R{order.deliveryFee?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-2">
          <span>Total</span>
          <span>R{order.totalAmount?.toFixed(2) || "0.00"}</span>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {canDownloadInvoice(order.status) && (
            <Button onClick={() => downloadInvoice(order.id)}>
              Download Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
