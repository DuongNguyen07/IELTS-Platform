export default function Input({ 
  label, 
  type = 'text',
  name, 
  value,
  onChange,
  placeholder = '',
  required = false,
  error = null
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-900 leading-normal">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`flex w-full rounded-lg text-gray-900 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 h-12 px-4 text-base transition-colors outline-none`}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}