// Hand-drawn underline that draws in while its `.group` parent is hovered or focused.
export default function Underline({ className = 'text-ultramarine' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible ${className}`}
    >
      <path
        d="M3 8 C60 4 130 9 190 6 C230 4 270 7 297 4"
        pathLength="1"
        className="hover-draw"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#crayon)"
      />
    </svg>
  );
}
