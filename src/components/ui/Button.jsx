export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  onClick,
  className = ''
}) {
  const baseStyles = 'w-full h-12 rounded-lg font-bold text-base transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}