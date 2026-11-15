import React from 'react';

interface NogglesProps {
  className?: string;
  size?: number;
  color?: string;
}

export const NogglesIcon: React.FC<NogglesProps> = ({ 
  className = "w-6 h-4", 
  size = 24,
  color = "#E63946" 
}) => {
  return (
    <svg 
      width={size * 1.5} 
      height={size} 
      viewBox="0 0 36 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Red / Primary Frame */}
      <rect x="0" y="4" width="16" height="16" fill={color} rx="1" />
      <rect x="20" y="4" width="16" height="16" fill={color} rx="1" />
      <rect x="16" y="8" width="4" height="4" fill={color} />
      
      {/* White Lens background */}
      <rect x="4" y="8" width="8" height="8" fill="#FFFFFF" />
      <rect x="24" y="8" width="8" height="8" fill="#FFFFFF" />
      
      {/* Black Pupils */}
      <rect x="8" y="10" width="4" height="4" fill="#121214" />
      <rect x="28" y="10" width="4" height="4" fill="#121214" />
    </svg>
  );
};
