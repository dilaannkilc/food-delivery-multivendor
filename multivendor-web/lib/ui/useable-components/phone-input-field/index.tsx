"use client";

import { IPhoneTextFieldProps } from "@/lib/utils/interfaces";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useState } from "react";

import InputSkeleton from "../custom-skeletons/inputfield.skeleton";

export default function CustomPhoneTextField({
  className,
  style,
  showLabel,
  placeholder = "",
  isLoading = false,
  value,

  page,
  onChange,
}: IPhoneTextFieldProps) {






  const [, setPhone] = useState("");

  const handlePhoneInputChange = (phone: string) => {
    setPhone(phone);
    onChange?.(phone);
  };







  const MaininputStyle =
    page === "vendor-profile-edit"
      ? {
          width: "100%",
          borderRadius: "0 5px 5px 0",
          height: "40px",
          borderColor: style?.borderColor || "",
        }
      : {
          width: "100%",
          borderRadius: "0 5px 5px 0",
          height: "40px",
          borderColor: style?.borderColor || "",
        };

  return !isLoading ? (
    <div className="relative flex w-full flex-col justify-center gap-y-1">
      {showLabel && (
        <label htmlFor="phone" className="text-sm font-[500] dark:text-white">
          {placeholder}
        </label>
      )}
      {}
      <div
        style={style}
        className={`flex items-center ${className} ${style?.borderColor === "red" ? "phone-error" : ""} bg-white text-black dark:bg-gray-800 dark:text-white `}
      >
        <PhoneInput
          country={"au"}
          value={value ?? ""}
          onChange={handlePhoneInputChange}
          disableSearchIcon={true}
          searchPlaceholder="Search country"
          inputStyle={{
            ...MaininputStyle,
            borderColor: style?.borderColor || MaininputStyle.borderColor,
            backgroundColor: "white",
            color: "#111827", 
          }}
          buttonStyle={{
            borderRight: "1px solid #ddd",
            width: "40px",
            backgroundColor: "white",
          }}
          searchStyle={{
            position: "relative",
            width: "100%",
            margin: "0",
            padding: "5px",
            borderRadius: "8px",
          }}
          containerClass="custom-phone-input w-full"
        />

        <style jsx global>{`
          
          .custom-phone-input .country-list {
            background-color: white;
            color: #111827; 
            border: 1px solid #d1d5db; 
            border-radius: 0.5rem;
          }
          .custom-phone-input .search {
            background-color: white;
            color: #111827;
            border: 1px solid #d1d5db;
          }
          .custom-phone-input .country-list .country:hover {
            background-color: #f3f4f6; 
          }
          .custom-phone-input .country-list .country.highlight {
            background-color: #e5e7eb; 
          }

          
          html.dark .custom-phone-input .form-control {
            background-color: #1f2937 !important; 
            color: #f9fafb !important; 
            border: 1px solid #4b5563 !important; 
          }

          
          html.dark .custom-phone-input .flag-dropdown,
          html.dark .custom-phone-input .selected-flag {
            background-color: #1f2937 !important; 
            border: 1px solid #374151 !important; 
          }

          
          html.dark .react-tel-input .flag-dropdown.open,
          html.dark .react-tel-input .selected-flag:focus,
          html.dark .react-tel-input .selected-flag:active {
            background-color: #1f2937 !important;
            box-shadow: none !important;
            outline: none !important;
          }

          
          .react-tel-input .flag-dropdown:hover,
          .react-tel-input .selected-flag:hover {
            background-color: transparent !important;
          }

          
          html.dark .custom-phone-input .country-list {
            background-color: #1f2937 !important; 
            color: #f9fafb !important;
            border: 1px solid #374151 !important; 
            border-radius: 0.5rem;
          }
          html.dark .custom-phone-input .search {
            background-color: #374151 !important; 
            color: #f9fafb !important;
            border: 1px solid #4b5563 !important;
          }
          html.dark .custom-phone-input .country-list .country:hover {
            background-color: #374151 !important; 
          }
          html.dark .custom-phone-input .country-list .country.highlight {
            background-color: #94e469 !important; 
            color: #111827 !important; 
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
    </div>
  ) : (
    <InputSkeleton />
  );
}
