import React, { ChangeEventHandler } from "react";

interface FormElementInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label: string;
  error: { name: string; message: string };
}

const FormElement: React.FC<FormElementInputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  required = false,
  error,
  ...inputProps
}) => {
  const className =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-white text-sm font-bold mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          rows={5}
          onChange={onChange as any}
          className={`${className} h-32`}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange as ChangeEventHandler<HTMLInputElement>}
          className={className}
          required={required}
          {...inputProps}
        />
      )}
      {error.name === name && error.message !== "" && (
        <p className="text-red-500 text-xs italic">{error.message}</p>
      )}
    </div>
  );
};

export default FormElement;
