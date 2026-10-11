import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Print from '../components/paper/Print.jsx';
import { useApi } from '../api.js';

// A few small tilts, repeated, so the polaroids look laid down by hand rather than stamped out.
const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.5];

// Every gallery image as a polaroid: 2 a row on phones, up to 5 on a wide screen. Click one to see it larger.
export default function Gallery() {
  const { data: images, error } = useApi('/api/images');
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Reveal className="pt-14 pb-24 md:pt-20 md:pb-32" aria-labelledby="gallery-title">
      <h1 id="gallery-title" className="text-display">
        Gallery.
      </h1>

      {error && <p className="mt-10 font-sans text-meta text-terracotta">{error}</p>}
      {images?.length === 0 && <p className="mt-10 text-body text-ink-soft">No images yet.</p>}
      {images?.length > 0 && (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-y-10">
          {images.map((image, i) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={image.description ? `Open: ${image.description}` : 'Open image'}
                className="block w-full cursor-zoom-in text-left"
              >
                <Print polaroid tilt={TILTS[i % TILTS.length]} delay={(i % 5) * 60} caption={image.description}>
                  <img src={image.thumbUrl} alt={image.description ?? ''} width={600} height={600} loading="lazy" className="aspect-square w-full bg-newsprint object-cover" />
                </Print>
              </button>
            </li>
          ))}
        </ul>
      )}

      {openIndex !== null && <Lightbox images={images} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />}
    </Reveal>
  );
}

// The chosen image large, over a dimmed page. Esc, the close button or a click outside the image closes it;
// the arrow keys or buttons step through the others.
function Lightbox({ images, index, onChange, onClose }) {
  const dialog = useRef(null);
  const image = images[index];
  const step = (by) => onChange((index + by + images.length) % images.length);

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  }

  const control = 'cursor-pointer px-3 py-2 font-sans text-label uppercase text-paper-bright hover:text-ochre';

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.target === e.currentTarget && dialog.current.close()}
      aria-label={image.description ?? 'Image'}
      className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-ink/85"
    >
      <figure className="flex flex-col items-center gap-3">
        <img src={image.fullUrl} alt={image.description ?? ''} className="max-h-[80dvh] max-w-[min(92vw,80rem)] object-contain" />
        {image.description && <figcaption className="font-hand text-note text-paper-bright">{image.description}</figcaption>}
      </figure>
      <div className="mt-2 flex justify-center gap-2">
        {images.length > 1 && (
          <button type="button" onClick={() => step(-1)} className={control}>
            ← Previous
          </button>
        )}
        <button type="button" onClick={() => dialog.current.close()} className={control}>
          Close
        </button>
        {images.length > 1 && (
          <button type="button" onClick={() => step(1)} className={control}>
            Next →
          </button>
        )}
      </div>
    </dialog>
  );
}
