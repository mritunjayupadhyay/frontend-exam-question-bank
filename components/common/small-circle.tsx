import React, { memo } from 'react';
import classNames from 'classnames'; // Assuming classNames library is installed

interface ISmallCircleProps {
  children: React.ReactNode;
  type?: "default"; // Removed unused types for clarity;
  style?: React.CSSProperties;
  className?: string; // Renamed from classNames to follow convention
}

const styles = {
  default: "w-6 h-6 bg-indigo-100 flex justify-center items-center rounded-full",
};

const SmallCircle: React.FC<ISmallCircleProps> = ({ 
  children, 
  type = "default", // Providing default value 
  style, 
  className 
}) => {
  const baseStyles = styles[type] || styles.default;
  
  return (
    <div 
    className={classNames(baseStyles, className)} 
    style={style}>
        {children}
    </div>
  );
};

export default memo(SmallCircle); // Memoize component to prevent unnecessary re-renders