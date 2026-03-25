import { Check, ShoppingCart, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import useCheckoutStep from "./useCheckoutStep";
const steps = [
  { key: "cart", label: "Cart", icon: <ShoppingCart size={18} /> },
  { key: "shipping", label: "Shipping", icon: <Truck size={18} /> },
  { key: "payment", label: "Payment", icon: <CreditCard size={18} /> },
];
export default function CheckoutProgress() {
  const currentStep = useCheckoutStep();
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const prevIndexRef = useRef(currentIndex);
  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);
  const prevIndex = prevIndexRef.current;
  const isGoingBack = currentIndex < prevIndex;
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-10 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.95,
                    backgroundColor: isCompleted
                      ? "hsl(var(--step-completed))"
                      : isActive
                        ? "hsl(var(--step-active))"
                        : "hsl(var(--step-pending))",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full shadow-lg cursor-pointer"
                  style={{
                    boxShadow: isActive
                      ? "0 4px 20px -4px hsl(var(--step-active) / 0.5)"
                      : isCompleted
                        ? "0 4px 20px -4px hsl(var(--step-completed) / 0.4)"
                        : "0 2px 8px -2px hsl(var(--foreground) / 0.1)",
                  }}
                >
                  {/* Checkmark overlay */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isCompleted ? 1 : 0,
                      scale: isCompleted ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-step-completed-foreground"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                  </motion.div>
                  {/* Icon overlay */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isCompleted ? 0 : 1,
                      scale: isCompleted ? 0.5 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-[18px] sm:[&>svg]:h-[18px] ${
                      isActive
                        ? "text-step-active-foreground"
                        : "text-step-pending-foreground"
                    }`}
                  >
                    {step.icon}
                  </motion.div>
                  {/* Pulse ring for active step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-step-active"
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>
                {/* Label */}
                <motion.span
                  initial={false}
                  animate={{
                    color:
                      isActive || isCompleted
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground))",
                    fontWeight: isActive ? 600 : 500,
                  }}
                  className="mt-2 sm:mt-3 text-[10px] sm:text-sm tracking-wide whitespace-nowrap"
                >
                  {step.label}
                </motion.span>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 &&
                (() => {
                  const nextIndex = index + 1;
                  const isFilled = nextIndex <= currentIndex;
                  const isForwardAnimate =
                    index === currentIndex - 1 && !isGoingBack;
                  const isBackwardAnimate =
                    index === currentIndex && isGoingBack;
                  let initialScaleX = isFilled ? 1 : 0;
                  if (isForwardAnimate) initialScaleX = 0;
                  if (isBackwardAnimate) initialScaleX = 1;
                  let animateScaleX = isFilled ? 1 : 0;
                  if (isForwardAnimate) animateScaleX = 1;
                  if (isBackwardAnimate) animateScaleX = 0;
                  return (
                    <div className="flex-1 mx-2 sm:mx-3 h-0.5 sm:h-1 bg-connector rounded-full overflow-hidden">
                      <motion.div
                        key={`${index}-${currentIndex}-${prevIndex}`}
                        className="h-full bg-connector-active rounded-full"
                        style={{ transformOrigin: "left" }}
                        initial={{ scaleX: initialScaleX }}
                        animate={{ scaleX: animateScaleX }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        }}
                      />
                    </div>
                  );
                })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
