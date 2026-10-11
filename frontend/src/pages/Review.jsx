import { useParams } from 'react-router';
import ArticleText from '../components/ArticleText.jsx';
import BackLink from '../components/BackLink.jsx';
import { useApi } from '../api.js';
import { formatNumber, formatPublished } from '../site.js';

// One review, in reading mode like an essay, with what is being reviewed set out above the text.
export default function Review() {
  const { number } = useParams();
  const { data: review, error, status } = useApi(`/api/reviews/${number}`);

  return (
    <article className="pt-10 pb-24 md:pb-32">
      <BackLink to="/reviews">All reviews</BackLink>

      {status === 404 && <p className="mt-12 text-body">There is no review Nº {formatNumber(number)}.</p>}
      {error && status !== 404 && <p className="mt-12 font-sans text-meta text-terracotta">{error}</p>}

      {review && (
        <>
          <header className="mt-12 md:mt-16">
            <p className="font-sans text-label uppercase text-graphite lining-nums">
              Nº {formatNumber(review.number)} · {formatPublished(review.publishedOn)}
            </p>
            <h1 className="mt-5 max-w-[18ch] text-display">{review.title}</h1>
          </header>

          <dl className="mt-10 grid max-w-[65ch] grid-cols-[6.5rem_1fr] items-baseline gap-x-6 gap-y-3 border-y border-rule py-5">
            <dt className="font-sans text-label uppercase text-graphite">Reviewing</dt>
            <dd className="text-h3 italic">{review.itemTitle}</dd>
            <dt className="font-sans text-label uppercase text-graphite">Author</dt>
            <dd className="text-body">{review.itemAuthor}</dd>
            {review.itemUrl && (
              <>
                <dt className="font-sans text-label uppercase text-graphite">Original</dt>
                <dd>
                  <a
                    href={review.itemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-label uppercase text-ultramarine transition-colors hover:text-ultramarine-deep"
                  >
                    → View the original
                  </a>
                </dd>
              </>
            )}
          </dl>

          <ArticleText body={review.body} className="mt-12 md:mt-16" />
        </>
      )}
    </article>
  );
}
