// Section label in the April Archive manner (STYLE_GUIDE §11): lowercase serif over a hairline.
export default function SectionHeading({ id, children, aside, action }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-4">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 id={id} className="text-h3">
          {children}
        </h2>
        {aside && <p className="text-caption italic text-ink-soft">{aside}</p>}
      </div>
      {action}
    </div>
  );
}
