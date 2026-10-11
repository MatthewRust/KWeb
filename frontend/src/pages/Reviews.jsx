import Reveal from '../components/Reveal.jsx';
import IndexRow from '../components/IndexRow.jsx';
import { useApi } from '../api.js';
import { formatNumber, formatPublished } from '../site.js';

// Every review as an index row, newest first, each linking to the full review.
export default function Reviews() {
  const { data: reviews, error } = useApi('/api/reviews');

  return (
    <Reveal className="pt-14 pb-24 md:pt-20 md:pb-32" aria-labelledby="reviews-title">
      <h1 id="reviews-title" className="text-display">
        Reviews.
      </h1>

      {error && <p className="mt-10 font-sans text-meta text-terracotta">{error}</p>}
      {reviews?.length === 0 && <p className="mt-10 text-body text-ink-soft">No reviews yet.</p>}
      {reviews?.length > 0 && (
        <ol className="mt-12 divide-y divide-rule border-y border-rule">
          {reviews.map((review, i) => (
            <IndexRow
              key={review.id}
              number={formatNumber(review.number)}
              title={review.title}
              dek={review.itemTitle}
              theme={review.itemAuthor}
              date={formatPublished(review.publishedOn)}
              to={`/reviews/${review.number}`}
              delay={i * 90}
            />
          ))}
        </ol>
      )}
    </Reveal>
  );
}
