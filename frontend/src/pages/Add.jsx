import { useState } from 'react';
import { SUBSECTIONS, formatPublished } from '../site.js';
import { buttonClass, inputClass, labelClass } from '../formStyles.js';

function thisMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const EMPTY = { title: '', body: '', subsection: SUBSECTIONS[0], itemTitle: '', itemAuthor: '' };

// Logged-in only. Adds an essay or a review to the content table.
export default function Add() {
  const [kind, setKind] = useState('essay');
  const [fields, setFields] = useState(EMPTY);
  const [publishedOn, setPublishedOn] = useState(thisMonth);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(null);

  function field(name) {
    return { value: fields[name], onChange: (e) => setFields({ ...fields, [name]: e.target.value }) };
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
        body: JSON.stringify({ kind, publishedOn, ...fields }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setSaved(data);
      setFields(EMPTY);
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
