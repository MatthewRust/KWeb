import Reveal from '../components/Reveal.jsx';
import IndexRow from '../components/IndexRow.jsx';
import { useApi } from '../api.js';
import { formatNumber, formatPublished } from '../site.js';

// The catalogue: every essay as an index row, newest first, each linking to the full essay.
export default function Essays() {
  const { data: essays, error } = useApi('/api/essays');

  return (
    <Reveal className="pt-14 pb-24 md:pt-20 md:pb-32" aria-labelledby="essays-title">
      <h1 id="essays-title" className="text-display">
        Essays.
      </h1>

      {error && <p className="mt-10 font-sans text-meta text-terracotta">{error}</p>}
      {essays?.length === 0 && <p className="mt-10 text-body text-ink-soft">No essays yet.</p>}
      {essays?.length > 0 && (
        <ol className="mt-12 divide-y divide-rule border-y border-rule">
          {essays.map((essay, i) => (
            <IndexRow
              key={essay.id}
              number={formatNumber(essay.number)}
              title={essay.title}
              theme={essay.subsection}
              date={formatPublished(essay.publishedOn)}
              to={`/essays/${essay.number}`}
              delay={i * 90}
            />
          ))}
        </ol>
      )}
    </Reveal>
  );
}
