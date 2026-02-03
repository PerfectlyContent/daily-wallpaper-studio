'use client';

interface PersonalTextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  label?: string;
  isCustomMode?: boolean;
}

export default function PersonalTextInput({
  value,
  onChange,
  maxLength,
  placeholder = 'Add a personal touch...',
  label = 'Personal Text',
  isCustomMode = false,
}: PersonalTextInputProps) {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 10;
  const isAtLimit = remaining <= 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-bone-muted text-sm uppercase tracking-wider">
          {label}
        </label>
        <span
          className={`
            text-xs font-mono
            ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-bone-dark'}
          `}
        >
          {remaining}
        </span>
      </div>

      {isCustomMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={3}
          className={`
            w-full px-4 py-3 rounded-2xl
            bg-background-secondary border-0
            text-bone placeholder:text-bone-dark
            focus:ring-1 focus:ring-bone/30 focus:outline-none
            resize-none transition-all duration-200
          `}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-2xl
            bg-background-secondary border-0
            text-bone placeholder:text-bone-dark
            focus:ring-1 focus:ring-bone/30 focus:outline-none
            transition-all duration-200
          `}
        />
      )}

      {isCustomMode && (
        <p className="text-bone-dark text-xs">
          Describe what you want to see. Be specific about colors, objects, mood, and style.
        </p>
      )}
    </div>
  );
}
