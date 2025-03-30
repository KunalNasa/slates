import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "primary" | "secondary" | "tertiary";
}

export function Input({ label, error, variant = "primary", className, ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        className={clsx(
          "px-3 py-5 rounded-md border text-sm transition-all duration-200 focus:outline-none",
          variant === "primary" && "border-black focus:ring-0 focus:ring-gray-400",
          variant === "secondary" && "border-blue-400 focus:ring-2 focus:ring-blue-600",
          variant === "tertiary" && "border-transparent bg-gray-100 focus:ring-2 focus:ring-gray-400",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
