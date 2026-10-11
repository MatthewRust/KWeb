// The main text of an essay or review, in reading mode (STYLE_GUIDE §7): one calm 65ch column,
// paragraphs separated by blank lines in the text, first-line indents after the first.
export default function ArticleText({ body, className = '' }) {
  return (
    <div className={`max-w-[65ch] text-body ${className}`}>
      {paragraphs(body).map((text, i) => (
        <p key={i} className={i > 0 ? 'indent-[1.5em]' : undefined}>
          {text}
        </p>
      ))}
    </div>
  );
}

// Single line breaks inside a paragraph are kept as spaces.
function paragraphs(body) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}
