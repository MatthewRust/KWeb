// Stand-in until Kirsty's photographs arrive: a dark frame around a lit window, after Daria's train-window shot.
export default function PhotoPlaceholder({ label = 'photo to come', className = '' }) {
  return (
    <div role="img" aria-label="Placeholder for a photograph" className={`grid place-items-center bg-ink ${className}`}>
      <div className="grid aspect-[4/3] w-3/5 place-items-center rounded-[14%] bg-newsprint">
        <span className="font-hand text-lg text-ink-soft">{label}</span>
      </div>
    </div>
  );
}
