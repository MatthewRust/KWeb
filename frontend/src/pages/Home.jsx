import { Link } from 'react-router';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import IndexRow from '../components/IndexRow.jsx';
import HandName from '../components/marks/HandName.jsx';
import Circled from '../components/marks/Circled.jsx';
import Scribble from '../components/marks/Scribble.jsx';
import Arrow from '../components/marks/Arrow.jsx';
import Print from '../components/paper/Print.jsx';
import PhotoPlaceholder from '../components/paper/PhotoPlaceholder.jsx';
import Clipping from '../components/paper/Clipping.jsx';
import StickyNote from '../components/paper/StickyNote.jsx';
import { expeditions, latestEssays, reading } from '../data/sample.js';

export default function Home() {
  return (
    <>
      <Masthead />
      <RecentExpeditions />
      <LatestEssays />
      <Reading />
    </>
  );
}

// After Daria's homepage: the crayon name runs straight into a serif sentence that finishes it.
function Masthead() {
  return (
    <Reveal className="relative pt-14 pb-24 md:pt-20 lg:pb-32">
      <h1 className="max-w-[38rem]">
        <span className="sr-only">Kirsty</span>
        <HandName className="w-full -rotate-[1.5deg] text-ultramarine" />
      </h1>
      <p className="rise mt-8 max-w-[30ch] text-lede md:mt-10" style={{ '--delay': '500ms' }}>
        writes about archaeology &amp; art history, and this is where she{' '}
        <Circled className="text-ochre" delay={1700}>
          keeps it all
        </Circled>
        .
      </p>
      <Scribble className="pointer-events-none absolute top-28 right-[10%] hidden w-72 text-ultramarine lg:block" delay={1300} />
    </Reveal>
  );
}

// Fieldwork laid out as paper on the page (April, WOB): a note card, two polaroids and a sticky note.
function RecentExpeditions() {
  const { aside, note, photoCaptions, sticky } = expeditions;

  return (
    <Reveal className="pb-24 md:pb-32" aria-labelledby="expeditions-heading">
      <SectionHeading id="expeditions-heading" aside={aside}>
        recent expeditions
      </SectionHeading>
      <div className="mt-14 grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6 lg:gap-x-10">
        <Clipping {...note} tilt={-2} className="mr-6 self-start md:col-span-6 md:mr-0 lg:col-span-4" />

        {/* The first polaroid overlaps the note card a little on wide screens, as prints do in the April collage. */}
        <div className="relative ml-auto w-[88%] md:col-span-6 md:ml-0 md:w-auto md:pt-20 lg:col-span-3 lg:-ml-14">
          <Print tilt={1.5} tape delay={120} caption={photoCaptions[0]}>
            <PhotoPlaceholder className="aspect-[4/5]" />
          </Print>
          <StickyNote tilt={-3} delay={300} className="relative -mt-2 ml-auto w-[80%] md:-mr-8">
            {sticky}
          </StickyNote>
          <Arrow className="absolute -right-24 bottom-20 hidden w-20 -rotate-[22deg] text-ultramarine lg:block" delay={700} />
        </div>

        <Print
          tilt={-2.5}
          tape
          delay={220}
          caption={photoCaptions[1]}
          className="mr-auto w-[88%] self-start md:col-span-6 md:col-start-4 md:mr-0 md:w-auto lg:col-span-4 lg:col-start-9"
        >
          <PhotoPlaceholder className="aspect-[4/3]" />
        </Print>
      </div>
    </Reveal>
  );
}

function LatestEssays() {
  return (
    <Reveal className="pb-24 md:pb-32" aria-labelledby="essays-heading">
      <SectionHeading
        id="essays-heading"
        action={
          <Link to="/essays" className="font-sans text-label uppercase text-ultramarine transition-colors hover:text-ultramarine-deep">
            → All essays
          </Link>
        }
      >
        latest essays
      </SectionHeading>
      <ol className="mt-6 divide-y divide-rule border-b border-rule">
        {latestEssays.map((essay, i) => (
          <IndexRow key={essay.number} {...essay} delay={i * 90} />
        ))}
      </ol>
    </Reveal>
  );
}

// The paper Kirsty is reading at the moment, and her thoughts on it.
function Reading() {
  const { paper, author, thoughts } = reading;

  return (
    <Reveal className="pb-24 md:pb-32" aria-labelledby="reading-heading">
      <SectionHeading id="reading-heading">what i’ve been reading</SectionHeading>
      <div className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-6">
        <dl className="rise grid grid-cols-[5.5rem_1fr] items-baseline gap-x-6 gap-y-4 md:col-span-6 lg:col-span-5">
          <dt className="font-sans text-label uppercase text-graphite">Paper</dt>
          <dd className="text-h2 italic">{paper}</dd>
          <dt className="font-sans text-label uppercase text-graphite">Author</dt>
          <dd className="text-lede">{author}</dd>
        </dl>
        <div className="rise md:col-span-6 lg:col-start-7" style={{ '--delay': '150ms' }}>
          <h3 className="text-h3">thoughts</h3>
          <p className="mt-3 max-w-[60ch] text-body">{thoughts}</p>
        </div>
      </div>
    </Reveal>
  );
}
