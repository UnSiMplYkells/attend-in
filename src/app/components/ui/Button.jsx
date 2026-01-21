const BUTTON_VARIANTS = {
  primary:
    "overflow-hidden bg-[#9e7242] hover:bg-[#b59365] focus-visible:outline-indigo-500",
  secondary:
    "overflow-hidden bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-500",
  danger:
    "overflow-hidden bg-red-600 hover:bg-red-500 focus-visible:outline-red-500",
};

export default function Button({
  variant = "primary",
  width = "w-full",
  padding = "px-3 py-3",
  margin = "mb-0 mt-0",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={` 
        flex ${width} justify-center rounded-md  ${margin} ${padding} 
        text-md font-semibold leading-6 text-white shadow-sm 
        transition-colors duration-200 
        focus-visible:outline focus-visible:outline-offset-2 
        ${BUTTON_VARIANTS[variant]}
        ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
