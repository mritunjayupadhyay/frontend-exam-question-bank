import React, { memo } from 'react';
import classNames from 'classnames'; // Assuming classNames library is installed

interface ITextProps {
  children: React.ReactNode;
  type?: "section-header" | "boldText" | "lightText" | "lightLabel" | "text" | "default"; // Removed unused types for clarity;
  style?: React.CSSProperties;
  className?: string; // Renamed from classNames to follow convention
}

const textStyles = {
  lightText: "font-noto-sans text-gray-500 text-sm",
  lightLabel: "text-[color: var(--Schemes-Outline, #767680)] font-inter text-sm font-normal",
  boldText: "text-black font-noto-sans font-medium text-sm",
  "section-header": "text-black font-noto-sans text-xl font-medium", 
  text: "text-black font-noto-sans text-2xl font-medium", // Default style 
  default: "font-inter", // Fallback style
};

const Text: React.FC<ITextProps> = ({ 
  children, 
  type = "text", // Providing default value 
  style, 
  className 
}) => {
  const baseStyles = textStyles[type] || textStyles.text;
  
  return (
    <p 
      className={classNames(baseStyles, className)} 
      style={style}
    >
      {children}
    </p>
  );
};

export default memo(Text); // Memoize component to prevent unnecessary re-renders