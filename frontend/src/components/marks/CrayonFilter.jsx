// Shared SVG filter that gives hand marks a waxy crayon edge (STYLE_GUIDE §9). Rendered once, in the Layout.
export default function CrayonFilter() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <filter id="crayon" filterUnits="userSpaceOnUse" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="wobble" />
        <feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.5" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="9" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.1" result="speckle" />
        <feComposite in="rough" in2="speckle" operator="in" />
      </filter>
    </svg>
  );
}
