import { Check, Package, Truck, CircleCheckBig } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const steps = [
  { key: "PAID", label: "Paid", icon: Check },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CircleCheckBig },
];

const statusIndex = {
  PAID: 0,
  SHIPPED: 1,
  DELIVERED: 2,
};

export default function OrderProgressTracker({ status }) {
  if (!["PAID", "SHIPPED", "DELIVERED"].includes(status)) return null;

  const activeIndex = statusIndex[status] ?? -1;
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  const prevIndex = prevIndexRef.current;
  const isGoingBack = activeIndex < prevIndex;

  return (
    <div className="mt-4 border border-neutral-200 rounded-lg p-3 sm:p-4 bg-neutral-50">
      <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">
        Order Progress
      </p>
      <div className="flex items-center justify-between relative">
        {/* Connector lines with animation - responsive positioning */}
        <div className="absolute top-3 sm:top-4 left-0 right-0 flex px-4 sm:px-6">
          {[0, 1].map((i) => {
            // Should this connector be filled?
            const isFilled = i < activeIndex;

            // Is the connector animating forward or backward?
            const isForwardAnimate = i === activeIndex - 1 && !isGoingBack;
            const isBackwardAnimate = i === activeIndex && isGoingBack;

            // Set transform origin for correct animation direction
            const transformOrigin = "left";

            // Determine initial scale for animation
            let initialScaleX = isFilled ? 1 : 0;
            if (isForwardAnimate) initialScaleX = 0;
            if (isBackwardAnimate) initialScaleX = 1;

            // Determine target scale for animation
            let animateScaleX = isFilled ? 1 : 0;
            if (isForwardAnimate) animateScaleX = 1;
            if (isBackwardAnimate) animateScaleX = 0;

            return (
              <div
                key={i}
                className="flex-1 h-[2px] mx-0.5 sm:mx-1 bg-neutral-200 rounded-full overflow-hidden"
              >
                <motion.div
                  key={`connector-${i}-${activeIndex}-${prevIndex}`}
                  className="h-full bg-black rounded-full"
                  style={{
                    transformOrigin: transformOrigin,
                  }}
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
          })}
        </div>

        {steps.map((step, i) => {
          const isComplete = i <= activeIndex;
          const isCurrent = i === activeIndex;
          const Icon = step.icon;

          // Responsive sizes
          const circleSize = "w-6 h-6 sm:w-8 sm:h-8";
          const iconSize = 12; // Base size for mobile
          const smIconSize = 14; // Size for larger screens

          return (
            <div
              key={step.key}
              className="flex flex-col items-center z-10 flex-1 min-w-[60px] sm:min-w-0"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1 : 0.95,
                  backgroundColor: isComplete ? "#000000" : "#e5e5e5",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className={`relative flex items-center justify-center ${circleSize} rounded-full cursor-pointer`}
                style={{
                  boxShadow: isCurrent
                    ? "0 4px 12px -4px rgba(0, 0, 0, 0.3)"
                    : isComplete
                      ? "0 2px 8px -2px rgba(0, 0, 0, 0.2)"
                      : "none",
                }}
              >
                {/* Check icon for completed steps */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isComplete ? 1 : 0,
                    scale: isComplete ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center text-white"
                >
                  {isComplete && i < steps.length - 1 && (
                    <Check
                      size={iconSize}
                      strokeWidth={3}
                      className="sm:hidden"
                    />
                  )}
                  {isComplete && i < steps.length - 1 && (
                    <Check
                      size={smIconSize}
                      strokeWidth={3}
                      className="hidden sm:block"
                    />
                  )}
                  {isComplete && i === steps.length - 1 && (
                    <>
                      <Icon size={iconSize} className="sm:hidden" />
                      <Icon size={smIconSize} className="hidden sm:block" />
                    </>
                  )}
                </motion.div>

                {/* Step icon (hidden when completed, except for last step) */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isComplete && i < steps.length - 1 ? 0 : 1,
                    scale: isComplete && i < steps.length - 1 ? 0.5 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`${isComplete ? "text-white" : i < activeIndex ? "text-white" : "text-neutral-400"}`}
                >
                  {(!isComplete || i === steps.length - 1) && (
                    <>
                      <Icon size={iconSize} className="sm:hidden" />
                      <Icon size={smIconSize} className="hidden sm:block" />
                    </>
                  )}
                </motion.div>

                {/* Pulse animation for active step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-black"
                    initial={{ opacity: 0.4, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.8 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Label with animation - responsive text */}
              <motion.span
                initial={false}
                animate={{
                  color: isComplete ? "#000000" : "#a3a3a3",
                  fontWeight: isCurrent ? 600 : isComplete ? 500 : 400,
                }}
                className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 transition-colors text-center px-1"
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
