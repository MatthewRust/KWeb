import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { buttonClass, inputClass, labelClass } from '../formStyles.js';

const MAX_DESCRIPTION = 50;

// Uploads one gallery image (stored on Cloudinary by the backend) with an optional short description.
export default function ImageUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [inputKey, setInputKey] = useState(0); // changing it clears the file input after an upload

  // A local preview of the chosen file, released when it changes.
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('description', description);
      const res = await fetch('/api/images', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not upload');
      setSaved(true);
      setFile(null);
      setDescription('');
      setInputKey((key) => key + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-5">
      <label className={labelClass}>
        Image
        <input
          key={inputKey}
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files[0] ?? null)}
          className={`${inputClass} cursor-pointer file:mr-4 file:cursor-pointer file:border file:border-ink file:bg-paper file:px-3 file:py-1 file:font-sans file:text-label file:uppercase`}
        />
      </label>

      {preview && <img src={preview} alt="Preview of the chosen image" className="max-h-72 self-start border border-rule object-contain" />}

      <label className={labelClass}>
        <span className="flex justify-between">
          Description, optional
          <span className="text-graphite tabular-nums">
            {description.length}/{MAX_DESCRIPTION}
          </span>
        </span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={MAX_DESCRIPTION} className={inputClass} />
      </label>

      {error && (
        <p role="alert" className="font-sans text-meta text-terracotta">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="font-sans text-meta">
          Uploaded. It’s now in the{' '}
          <Link to="/gallery" className="text-ultramarine underline underline-offset-4">
            gallery
          </Link>
          .
        </p>
      )}

      <button type="submit" disabled={saving} className={buttonClass}>
        {saving ? 'Uploading…' : 'Upload image'}
      </button>
    </form>
  );
}
