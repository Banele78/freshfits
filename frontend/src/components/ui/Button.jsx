export default function Button({
  children,
  onClick,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "md",
  loadingText = "Processing...",
  className = "",
  type = "button",
}) {
  const isDisabled = disabled || loading;

  const baseStyles =
    "transition-all duration-200 ease-in-out flex items-center justify-center font-medium";

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-sm",
    md: "px-6 py-3 text-base rounded-lg",
  };

  const variants = {
    primary: isDisabled
      ? "bg-gray-400 text-white cursor-not-allowed"
      : `
          bg-black text-white cursor-pointer
          hover:bg-neutral-900
          hover:shadow-md
          hover:-translate-y-[1px]
          active:translate-y-0
        `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${sizes[size]} ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
