export function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const base =
    'inline-flex items-center justify-center px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50';
  const variants = {
    primary:
      'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-500 hover:to-purple-500 focus:ring-fuchsia-500/50',
    secondary:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
      'border-2 border-red-600 text-red-600 hover:bg-red-100 focus:ring-red-500',
  };
  return (
    <button type={type} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
