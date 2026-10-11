import { useState } from 'react';
import { SUBSECTIONS, formatPublished } from '../site.js';
import { buttonClass, inputClass, labelClass } from '../formStyles.js';

function thisMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const EMPTY = { title: '', body: '', subsection: SUBSECTIONS[0], itemTitle: '', itemAuthor: '', itemUrl: '' };
const EMPTY_SOURCE = { name: '', url: '' };

// Logged-in only. Adds an essay or a review to the content table.
export default function Add() {
  const [kind, setKind] = useState('essay');
  const [fields, setFields] = useState(EMPTY);
  const [publishedOn, setPublishedOn] = useState(thisMonth);
  const [bibliography, setBibliography] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(null);

  function field(name) {
    return { value: fields[name], onChange: (e) => setFields({ ...fields, [name]: e.target.value }) };
  }

  function sourceField(index, name) {
    return {
      value: bibliography[index][name],
      onChange: (e) => setBibliography(bibliography.map((item, i) => (i === index ? { ...item, [name]: e.target.value } : item))),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaved(null);
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, publishedOn, ...fields, bibliography }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setSaved(data);
      setFields(EMPTY);
      setBibliography([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="py-12">
      <h1 className="text-h2">Add</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-5">
        <fieldset className="flex gap-6 font-sans text-label uppercase">
          <legend className="sr-only">Type</legend>
          {['essay', 'review'].map((value) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="kind" value={value} checked={kind === value} onChange={() => setKind(value)} className="accent-ultramarine" />
              {value}
            </label>
          ))}
        </fieldset>

        <label className={labelClass}>
          {kind === 'essay' ? 'Title' : 'Review title'}
          <input required className={inputClass} {...field('title')} />
        </label>

        {kind === 'essay' ? (
          <label className={labelClass}>
            Subsection
            <select className={inputClass} {...field('subsection')}>
              {SUBSECTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <>
            <label className={labelClass}>
              Title of the item reviewed
              <input required className={inputClass} {...field('itemTitle')} />
            </label>
            <label className={labelClass}>
              Author of the item reviewed
              <input required className={inputClass} {...field('itemAuthor')} />
            </label>
            <label className={labelClass}>
              Link to the original, optional
              <input type="url" placeholder="https://" className={inputClass} {...field('itemUrl')} />
            </label>
          </>
        )}

        <label className={labelClass}>
          Date published
          <input type="month" required value={publishedOn} onChange={(e) => setPublishedOn(e.target.value)} className={`${inputClass} self-start`} />
        </label>

        <label className={labelClass}>
          Text
          <textarea required rows={16} className={inputClass} {...field('body')} />
        </label>

        {kind === 'essay' && (
          <fieldset className="flex flex-col gap-4 border-t border-rule pt-4">
            <legend className="float-left mb-1 font-sans text-label uppercase">Bibliography</legend>
            {bibliography.map((item, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 border-b border-rule pb-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <label className={labelClass}>
                  Name
                  <input required className={inputClass} {...sourceField(i, 'name')} />
                </label>
                <label className={labelClass}>
                  Link
                  <input type="url" required placeholder="https://" className={inputClass} {...sourceField(i, 'url')} />
                </label>
                <button
                  type="button"
                  onClick={() => setBibliography(bibliography.filter((_, j) => j !== i))}
                  className="cursor-pointer self-start py-2 font-sans text-label uppercase text-terracotta hover:underline sm:self-end"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setBibliography([...bibliography, EMPTY_SOURCE])} className={buttonClass}>
              + Add source
            </button>
          </fieldset>
        )}

        {error && (
          <p role="alert" className="font-sans text-meta text-terracotta">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="font-sans text-meta">
            Saved “{saved.title}” as {saved.kind} {saved.number}, {formatPublished(saved.publishedOn)}. ID {saved.id}.
          </p>
        )}

        <button type="submit" disabled={saving} className={buttonClass}>
          {saving ? 'Saving…' : `Add ${kind}`}
        </button>
      </form>
    </section>
  );
}
