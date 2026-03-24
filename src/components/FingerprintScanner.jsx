
// state: 'idle' | 'scanning' | 'success' | 'error'
const FingerprintScanner = ({ state = 'idle', onScan, size = 'md', disabled = false }) => {

  const sizes = {
    sm: { box: 'w-28 h-28', svg: 56 },
    md: { box: 'w-40 h-40', svg: 72 },
    lg: { box: 'w-48 h-48', svg: 88 },
  };

  const { box, svg } = sizes[size] || sizes.md;

  const borderColor = {
    idle: 'border-purple-200 hover:border-blue-400',
    scanning: 'border-blue-500 fp-scanning',
    success: 'border-green-500 bg-green-50',
    error: 'border-red-400 bg-red-50',
  }[state];

  const strokeColor = {
    idle: '#5d53cf',
    scanning: '#5d53cf',
    success: '#22c55e',
    error: '#ef4444',
  }[state];

  const label = {
    idle: 'Click to Scan',
    scanning: 'Scanning...',
    success: '✓ Verified!',
    error: 'Try Again',
  }[state];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={!disabled && state !== 'scanning' && state !== 'success' ? onScan : undefined}
        className={`
          ${box} rounded-3xl border-2 bg-blue-50
          flex items-center justify-center relative overflow-hidden
          cursor-pointer transition-all duration-300 select-none
          ${borderColor}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        <div className="fp-scan-line" />
        <svg width={svg} height={svg} viewBox="0 0 80 80" fill="none">
          <ellipse cx="40" cy="40" rx="32" ry="32"
            stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          <path d="M40 14c-14.359 0-26 11.641-26 26"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 20c-11.046 0-20 8.954-20 20"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 26c-7.732 0-14 6.268-14 14"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 32c-4.418 0-8 3.582-8 8"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="40" r="3" fill={strokeColor} opacity="0.5" />
          <path d="M54 40c0 7.732-6.268 14-14 14"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M60 40c0 11.046-8.954 20-20 20"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M66 40c0 14.359-11.641 26-26 26"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M48 26c3.869 3.184 6.4 8 6.4 13.4"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M54 22c5.6 4.58 9.2 11.5 9.2 19.2"
            stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className={`text-sm font-semibold ${state === 'success' ? 'text-green-600' :
        state === 'error' ? 'text-red-500' :
          state === 'scanning' ? 'text-blue-500 animate-pulse' :
            'text-gray-600'
        }`}>{label}</p>
    </div>
  )
}

export default FingerprintScanner;