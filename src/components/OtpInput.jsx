import { useRef } from "react";

const OtpInput = ({ length = 6, value, onChange }) => {

  const refs = useRef([]);

  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = val;
    onChange(next.join(''));
    if (val && idx.length - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-1">
      {
        digits.map((d, i) => (
          <input type="text" key={i} ref={el => refs.current[i] = el} inputMode="numeric" maxLength={1} value={d} onChange={e => handleChange(i, e)} onKeyDown={e => handleKeyDown(i, e)} onPaste={handlePaste} className={`
            w-10 h-12 text-center text-xl font-semibold
            border-2 rounded-xl outline-none transition-all duration-200
            ${d
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-purple-200 bg-white text-gray-800 focus:border-blue-400'}
          `} />
        ))
      }
    </div>
  )
}

export default OtpInput;