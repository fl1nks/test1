/** Мини-искра/звезда в духе логотипа — разделитель в бегущей строке */
export default function Spark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c.6 5.4 3.1 8.9 5.4 11.1C15 13.3 12.6 18.6 12 24c-.6-5.4-3.1-8.9-5.4-11.1C9 8.9 11.4 5.4 12 0Z" />
    </svg>
  );
}
