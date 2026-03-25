export default function PaymentMethod() {
  return (
    <section className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-3 shadow-md">
      <h2 className="text-lg sm:text-xl font-light tracking-wide text-card-foreground">
        Payment
      </h2>

      <label className="flex items-center gap-3 p-3 sm:p-4 rounded cursor-pointer border transition-shadow border-step-active bg-step-active/5">
        <input
          type="radio"
          name="payment"
          className="mt-0.5 flex-shrink-0 accent-[hsl(var(--step-active))]"
          defaultChecked
        />
        <span>Card Payment</span>
      </label>

      <label className="flex items-center gap-3  p-3 sm:p-4 border border-gray-200 p-4 rounded cursor-pointer opacity-50">
        <input type="radio" disabled />
        <span>Pay on Delivery (Coming soon)</span>
      </label>
    </section>
  );
}
