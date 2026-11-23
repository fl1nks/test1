export default function Aperture({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4.6" strokeLinecap="round">
        <circle cx="32" cy="32" r="17" />
        <path d="M32 23.4V12M40.9 27.7l10.2-5.9M40.9 36.3l10.2 5.9M32 40.6V52M23.1 36.3 12.9 42.2M23.1 27.7l-10.2-5.9" />
      </g>
      <circle cx="32" cy="32" r="4.4" fill="currentColor" />
    </svg>
  );
}
