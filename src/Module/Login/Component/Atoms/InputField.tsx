import React, { useState } from "react";
import Icon from "../../../Common/Component/Icon";

interface InputFieldProps {
  type: string;
  placeholder: string;
  label: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  label,
  icon,
  value,
  onChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-xs w-full text-left">
      <label className="text-label-md font-bold text-on-surface-variant select-none">
        {label}
      </label>
      <div className="relative flex items-center w-full">
        {/* Left Side Icon */}
        <span className="absolute left-3 text-on-surface-variant/70 select-none">
          <Icon name={icon} className="text-xl block" />
        </span>
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-10 py-3 bg-surface-container border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 text-body-md transition-all outline-none"
        />
        {/* Password toggle icon */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-on-surface-variant/70 hover:text-primary transition-colors cursor-pointer focus:outline-none border-none bg-transparent"
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-xl block" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
