import React, { memo } from 'react';
import classNames from 'classnames'; // Assuming classNames library is installed

interface ITextProps {
  children: React.ReactNode;
  type?: "section-header" | "boldText" | "text";
  style?: React.CSSProperties;
  className?: string; // Renamed from classNames to follow convention
}

const textStyles = {
  boldText: "text-black font-noto-sans font-medium text-sm",
  "section-header": "text-black font-noto-sans text-2xl font-medium", // Using text-2xl instead of text-[22px]
  text: "text-black font-noto-sans text-2xl font-medium", // Default style same as section-header
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