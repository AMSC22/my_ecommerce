import React from "react";

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface FormComponentProps {
  fields: FormField[];
  values: { [key: string]: string };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonLabel: string;
}

const FormComponent: React.FC<FormComponentProps> = ({
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  submitButtonLabel,
}) => {
  if (!fields || !Array.isArray(fields)) {
    console.error("Invalid 'fields' prop in FormComponent. Expected an array.");
    return <div>Erreur dans la configuration du formulaire.</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="font-medium mb-1">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder || ""}
            value={values[field.name] || ""}
            onChange={onChange}
            className={`p-2 border rounded ${
              errors[field.name] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[field.name] && (
            <span className="text-red-500 text-sm">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {submitButtonLabel}
      </button>
    </form>
  );
};

export default FormComponent;
