export default function RotatingBadge({
  id = "tans-rotating-badge",
  text = "TANS STUDIO / COLOR / RETOUCH / ",
  className = "",
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="relative grid h-full w-full place-items-center rounded-full border border-ink/15 bg-bone/90 text-ink backdrop-blur-sm">
        <svg viewBox="0 0 120 120" className="badge-spin h-full w-full">
          <defs>
            <path
              id={id}
              d="M60,14 a46,46 0 1,1 0,92 a46,46 0 1,1 0,-92"
              fill="none"
            />
          </defs>
        <text
          fill="currentColor"
          fontSize="8.2"
          fontWeight="600"
          letterSpacing="0.12em"
        >
            <textPath href={`#${id}`} startOffset="0">
              {text}
            </textPath>
          </text>
        </svg>
        <span className="absolute h-1.5 w-1.5 rounded-full bg-magenta" />
      </div>
    </div>
  );
}
