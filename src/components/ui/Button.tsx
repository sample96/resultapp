import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className = '', children, ...props }, ref) => (
  <button
    ref={ref}
    className={`transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ripple animate-bounce-in ${className}`}
    {...props}
  >
    {children}
  </button>
));

Button.displayName = 'Button';

export default Button; 