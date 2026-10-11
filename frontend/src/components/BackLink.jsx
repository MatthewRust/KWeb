import { Link } from 'react-router';

// "← All essays" and the like, at the top of a single essay or review.
export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="font-sans text-label uppercase text-ultramarine transition-colors hover:text-ultramarine-deep">
      ← {children}
    </Link>
  );
}
