import { useEffect, useState } from "react";
import { useAddress } from "../../context/AddressContext";
import { useCart } from "../../context/CartContext";

export default function DeliveryMethod({ onChange }) {
  const { setDeliveryMethod } = useAddress();
  const { cart } = useCart();

  const FREE_DELIVERY_THRESHOLD = 1000;

  const methods = [
    {
      id: "standard",
      title: "Standard Delivery",
      description: "2–5 business days",
      price: 60,
    },
    {
      id: "express",
      title: "Express Delivery",
      description: "1–2 business days",
      price: 120,
    },
  ];

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const first = methods[0];
    const finalMethod =
      first.id === "standard" && cart.totalPrice >= FREE_DELIVERY_THRESHOLD
        ? { ...first, price: 0 }
        : first;

    setSelected(first.id);
    setDeliveryMethod(finalMethod);
    onChange?.(finalMethod);
  }, [cart.totalPrice]);

  const isFreeStandard = cart.totalPrice >= FREE_DELIVERY_THRESHOLD;

  const handleChange = (method) => {
    const finalMethod =
      method.id === "standard" && isFreeStandard
        ? { ...method, price: 0 }
        : method;

    setSelected(method.id);
    setDeliveryMethod(finalMethod);
    onChange?.(finalMethod);
  };

  return (
    <section className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-3 shadow-md">
      <h2 className="text-lg sm:text-xl font-light tracking-wide text-card-foreground">
        Delivery
      </h2>

      {methods.map((method) => {
        const showFree = method.id === "standard" && isFreeStandard;
        const isSelected = selected === method.id;

        return (
          <label
            key={method.id}
            className={`flex items-center gap-3 p-3 sm:p-4 rounded cursor-pointer border transition-shadow
              ${
                isSelected
                  ? "border-step-active bg-step-active/5"
                  : "border-border hover:border-muted-foreground/40 hover:shadow-sm"
              }`}
          >
            <input
              type="radio"
              name="delivery"
              checked={isSelected}
              onChange={() => handleChange(method)}
              className="mt-0.5 flex-shrink-0 accent-[hsl(var(--step-active))]"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base text-foreground truncate">
                {method.title}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {method.description}
              </p>
            </div>

            <span
              className={`font-semibold text-sm sm:text-base flex-shrink-0 ${
                showFree ? "text-step-completed" : "text-foreground"
              }`}
            >
              {showFree ? "FREE" : `R${method.price}`}
            </span>
          </label>
        );
      })}
    </section>
  );
}
