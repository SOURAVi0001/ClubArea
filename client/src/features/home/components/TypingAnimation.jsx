import { useEffect, useState } from 'react';

/**
 * Reusable typing animation: types out text character-by-character (via CSS steps),
 * holds, then resets. Responsive text variants via props.
 */
const DEFAULT_PHRASES = {
  desktop: 'ALL CLUBS, ONE-STOP SOLUTION!',
  tablet: 'ALL CLUBS, ONE SOLUTION!',
  mobile: 'ALL CLUBS, ONE STOP!',
};

const DEFAULT_DURATIONS = { desktop: 7, tablet: 6, mobile: 5 };
const DEFAULT_STEPS = { desktop: 29, tablet: 24, mobile: 20 };

function getBreakpoint() {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w <= 480) return 'mobile';
  if (w <= 768) return 'tablet';
  return 'desktop';
}

export function TypingAnimation({
  phrases = DEFAULT_PHRASES,
  durations = DEFAULT_DURATIONS,
  steps = DEFAULT_STEPS,
  className = '',
  style = {},
}) {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint);

  useEffect(() => {
    const onResize = () => setBreakpoint(getBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const text = phrases[breakpoint] ?? DEFAULT_PHRASES.desktop;
  const duration = durations[breakpoint] ?? DEFAULT_DURATIONS.desktop;
  const stepCount = steps[breakpoint] ?? DEFAULT_STEPS.desktop;
  const charCount = text.length;

  return (
    <div className={`w-full overflow-visible ${className}`}>
      <h1
        className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl min-w-max text-white whitespace-nowrap overflow-visible inline-block relative"
        style={{ fontFamily: "'Pacifico', 'Brush Script Std', cursive", ...style }}
        aria-live="polite"
      >
        <span
          className="inline-block overflow-hidden whitespace-nowrap align-bottom"
          style={{
            animation: `hero-typing ${duration}s steps(${stepCount}, end) infinite`,
          }}
        >
          {text}
        </span>
      </h1>
      <style>{`
        @keyframes hero-typing {
          0% { max-width: 0; }
          40% { max-width: ${charCount}ch; }
          60% { max-width: ${charCount}ch; }
          100% { max-width: 0; }
        }
      `}</style>
    </div>
  );
}
