import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sparkles, Zap, Gift } from "lucide-react";
const benefits = [
  {
    icon: Zap,
    text: "Early access to drops",
  },
  {
    icon: Gift,
    text: "Exclusive discounts",
  },
  {
    icon: Sparkles,
    text: "Local brand spotlights",
  },
];
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full bg-newsletter py-16 md:py-24 relative overflow-hidden mt-12"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-white/5 to-transparent blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-newsletter-input border border-newsletter-border mb-6"
            >
              <Mail className="w-4 h-4 text-newsletter-foreground" />
              <span className="text-sm font-medium text-newsletter-foreground tracking-wide uppercase">
                Join the Movement
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-newsletter-foreground mb-4 leading-tight font-poppins tracking-tight">
              Stay Fresh.
              <br />
              <span className="text-newsletter-muted">Stay First.</span>
            </h2>
            <p className="text-newsletter-muted text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-8">
              Get the inside scoop on Mzansi's hottest drops, exclusive deals,
              and the brands shaping street culture.
            </p>
            {/* Benefits */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-newsletter-muted"
                >
                  <benefit.icon className="w-4 h-4" />
                  <span className="text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Right content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-md"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-6 py-5 pr-40 rounded-xl bg-newsletter-input border-2 border-newsletter-border text-newsletter-foreground placeholder:text-newsletter-muted focus:outline-none focus:border-newsletter-foreground transition-all duration-300 text-base"
                  required
                />
                <motion.button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-newsletter-foreground text-newsletter rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-newsletter-muted hover:text-newsletter"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <motion.span
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </div>
              {/* Success message */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isSubmitted ? 1 : 0,
                  y: isSubmitted ? 0 : 10,
                }}
                className="absolute -bottom-10 left-0 right-0 text-center"
              >
                <span className="text-newsletter-foreground text-sm font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  You're in! Welcome to the crew.
                </span>
              </motion.div>
            </form>
            <p className="text-newsletter-muted text-xs mt-14 text-center">
              No spam, just fire drops. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
export default NewsletterSection;
