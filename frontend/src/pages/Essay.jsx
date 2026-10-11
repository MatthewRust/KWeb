import { useParams } from 'react-router';
import ArticleText from '../components/ArticleText.jsx';
import BackLink from '../components/BackLink.jsx';
import { useApi } from '../api.js';
import { formatNumber, formatPublished } from '../site.js';

// One essay, in reading mode (STYLE_GUIDE §7).
export default function Essay() {
  const { number } = useParams();
  const { data: essay, error, status } = useApi(`/api/essays/${number}`);

  return (
    <article className="pt-10 pb-24 md:pb-32">
      <BackLink to="/essays">All essays</BackLink>

      {status === 404 && <p className="mt-12 text-body">There is no essay Nº {formatNumber(number)}.</p>}
      {error && status !== 404 && <p className="mt-12 font-sans text-meta text-terracotta">{error}</p>}

      {essay && (
        <>
          <header className="mt-12 md:mt-16">
            <p className="font-sans text-label uppercase text-graphite lining-nums">
              Nº {formatNumber(essay.number)} · {essay.subsection} · {formatPublished(essay.publishedOn)}
            </p>
            <h1 className="mt-5 max-w-[18ch] text-display">{essay.title}</h1>
          </header>

          <ArticleText body={essay.body} className="mt-12 md:mt-16" />

          {essay.bibliography.length > 0 && (
            <details className="group mt-16 max-w-[65ch] border-t border-rule pt-4">
              <summary className="flex cursor-pointer list-none items-baseline justify-between text-h3 [&::-webkit-details-marker]:hidden">
                Bibliography
                <span aria-hidden="true" className="font-sans text-label text-graphite transition-transform group-open:rotate-90">
                  ▶
                </span>
              </summary>
              <ol className="mt-4 space-y-3">
                {essay.bibliography.map((item, i) => (
                  <li key={i} className="text-body">
                    <a href={item.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-4 transition-colors hover:text-ultramarine hover:decoration-ultramarine">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </>
      )}
    </article>
  );
}
