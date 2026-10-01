import { useEffect, useRef, useState } from 'react';

// Wraps a section so its .settle / .rise / .draw children animate the first time it scrolls into view.
export default function Reveal({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <Tag ref={ref} data-inview={inView || undefined} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
