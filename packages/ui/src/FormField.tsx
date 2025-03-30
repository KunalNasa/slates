interface FormFieldProps {
    label?: string;
    name: string;
    errors: any; // Type from React Hook Form
    children: React.ReactNode;
}
  
  export function FormField({ label, name, errors, children }: FormFieldProps) {
    return (
      <div className="flex flex-col my-5 gap-1">
        <label htmlFor={name} className="text-gray-700 font-medium">
          {label}
        </label>
        {children}
        {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
      </div>
    );
  }
  