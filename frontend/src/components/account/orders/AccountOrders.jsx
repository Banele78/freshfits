import { useEffect, useState } from "react";
import { getUserOrders } from "../../../api/order";
import Button from "../../ui/Button";
import OrderImageCollage from "./OrderImageCollage";
import { useAuth } from "../../../context/AuthContext";
import Pagination from "../../ui/Pagination";
import { useNavigate } from "react-router-dom";

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null); // reset error
        const data = await getUserOrders(currentPage, PAGE_SIZE);

        setOrders(data?.orders || []);
        setTotalPages(data?.totalPages || 0);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center py-60 md:py-40">
        <div className="w-6 h-6 border border-neutral-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!orders.length && totalPages === 0) {
    return <p className="text-sm text-neutral-400">You have no orders yet.</p>;
  }

  const DOWNLOADABLE_STATUSES = ["PAID", "SHIPPED", "DELIVERED"];

  function canDownloadInvoice(status) {
    return DOWNLOADABLE_STATUSES.includes(status);
  }

  return (
    <div>
      <h2 className="text-lg uppercase tracking-widest font-medium ">Orders</h2>

      <div className="divide-y divide-neutral-200">
        {orders.map((order) => (
          <div
            key={order.id}
            className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            {/* Left section: Order info, images, and address */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-wrap">
              <div className="flex-1 min-w-[150px]">
                <p className="text-sm tracking-wide font-medium">
                  Order {order.orderNumber}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <div className="flex gap-4 mt-2 flex-wrap">
                  <OrderImageCollage
                    items={order.items}
                    totalItems={order.totalItemsCount}
                  />

                  {/* Shipping address */}
                  <div className="text-sm text-neutral-500 flex-1 h-32 flex flex-col justify-between">
                    <p className="font-semibold">To:</p>
                    <p className="font-medium">
                      {order.shippingAddress.name}{" "}
                      {order.shippingAddress.surname} (
                      {order.shippingAddress.addressType})
                    </p>
                    <p>
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && (
                        <span>, {order.shippingAddress.addressLine2}</span>
                      )}
                    </p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.province}
                    </p>
                    <p>
                      {order.shippingAddress.country}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.phoneNo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section: Pricing + status */}
            <div className="w-full md:w-auto mt-4 md:mt-0 self-auto text-right md:text-left flex-shrink-0">
              <p className="text-xs text-neutral-500 text-right md:text-right">
                {order.totalItemsCount} item{order.totalItemsCount !== 1 && "s"}
              </p>

              <div className="mt-2 text-sm space-y-1 w-full">
                <div className="flex justify-between gap-6">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>R{order.subtotalAmount?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-neutral-500">Delivery</span>
                  <span>R{order.deliveryFee?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between gap-6 font-medium border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>R{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 mt-3 text-right md:text-right">
                {order.status}
              </p>

              <div className="mt-3 flex flex-col gap-2 w-full md:w-auto items-stretch md:items-end">
                {/* View Order Button */}
                <button
                  onClick={() =>
                    navigate(`/account/order/${order.orderNumber}`)
                  }
                  className="px-4 py-1.5 text-sm border cursor-pointer border-black text-black rounded hover:bg-black hover:text-white transition-colors duration-200 w-full md:w-auto"
                >
                  View Order
                </button>

                {/* Pay Now Button */}
                {order.status === "PENDING" && order.yocoCheckoutUrl && (
                  <Button
                    onClick={() => window.open(order.yocoCheckoutUrl, "_blank")}
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    Pay Now
                  </Button>
                )}

                {/* Download Invoice Button */}
                {canDownloadInvoice(order.status) && (
                  <Button
                    onClick={() => downloadInvoice(order.id)}
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    Download Invoice
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxVisible={3}
        scrollOnChange={true}
      />
    </div>
  );
}
