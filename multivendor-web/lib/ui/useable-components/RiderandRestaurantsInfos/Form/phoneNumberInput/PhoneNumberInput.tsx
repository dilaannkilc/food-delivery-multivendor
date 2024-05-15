import PhoneInput from "react-phone-input-2";
import { useField } from "formik";

const PhoneNumberInput = () => {
  const [field, , helpers] = useField("phoneNumber");
  return (
    <div>
      <PhoneInput

      country={"pk"}
     
      value={field.value}
      onChange={(value) => helpers.setValue(value)}
      inputProps={{
        name: "phoneNumber",
        id: "phoneNumber",
        className:
          "w-full border-2 border-gray-200 dark:border-gray-600 py-2 rounded-lg " +
          "focus:outline-none focus:ring-0 active:outline-none " +
          "bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 " +
          (typeof window !== "undefined" &&
          document?.documentElement?.dir === "rtl"
            ? "pr-12"
            : "pl-12"),
      }}
      containerClass="custom-phone-input w-full"
      buttonClass="custom-phone-button"
          />

      <style jsx global>{`
        
        .custom-phone-input .flag-dropdown {
          background-color: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem 0 0 0.5rem;
        }

        .custom-phone-input .form-control {
          background-color: white;
          color: #111827; 
        }

        .custom-phone-input .country-list {
          background-color: white;
          color: #111827;
          border: 1px solid #d1d5db;
        }

        
        html.dark .custom-phone-input .form-control {
          background-color: #374151 !important; 
          color: #f9fafb !important; 
          border: 1px solid #4b5563 !important; 
        }

        html.dark .custom-phone-input .flag-dropdown {
          background-color: #374151 !important; 
          border: 1px solid #4b5563 !important; 
        }

        html.dark .custom-phone-input .selected-flag {
          background-color: #374151 !important;
        }

        html.dark .custom-phone-input .country-list {
          background-color: #1f2937 !important; 
          color: #f9fafb !important;
          border: 1px solid #374151 !important; 
        }

        html.dark .custom-phone-input .country-list .country:hover {
          background-color: #374151 !important; 
        }

        html.dark .custom-phone-input .country-list .country.highlight {
          background-color: #94e469 !important; 
          color: #111827 !important; 
        }

        
        html[dir="rtl"] .custom-phone-input .flag-dropdown {
          right: 0; 
          left: auto !important; 
          border-radius: 0 0.5rem 0.5rem 0; 
          border: 2px solid #e5e7eb; 
           
          padding-right: 8px; 
        }

        html[dir="rtl"] .custom-phone-input .selected-flag {
          right: 0;
          left: auto !important;
          padding-right: 0.5rem; 
        }

        
        html[dir="rtl"] .custom-phone-input .selected-flag .arrow {
          right: 20px !important; 
          left: auto !important;
          display: block !important;
          position: absolute;
        }
      `}</style>
    </div>
  );
};

export default PhoneNumberInput;
