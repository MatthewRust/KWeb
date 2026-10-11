import { createHash } from 'node:crypto';

// Cloudinary holds the gallery's image files. Set CLOUDINARY_URL (from the Cloudinary dashboard) in .env:
//   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
const FOLDER = 'kweb';

function credentials() {
  const match = process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  return match && { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
}

export function isConfigured() {
  return Boolean(credentials());
}

// Uploads an image (a Buffer) with Cloudinary's signed upload API. Returns { publicId, url, width, height }.
export async function uploadImage(buffer, mimetype) {
  const { apiKey, apiSecret, cloudName } = credentials();
  const timestamp = Math.floor(Date.now() / 1000);
  // The signature is a SHA-1 of the signed parameters, sorted and joined, followed by the API secret.
  const signature = createHash('sha1').update(`folder=${FOLDER}&timestamp=${timestamp}${apiSecret}`).digest('hex');

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimetype }));
  form.append('folder', FOLDER);
  form.append('timestamp', String(timestamp));
  form.append('api_key', apiKey);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${data.error?.message ?? res.status}`);
  return { publicId: data.public_id, url: data.secure_url, width: data.width, height: data.height };
}

// Cloudinary resizes on the fly from instructions in the URL, e.g. .../upload/w_600,h_600,c_fill/... .
export function transformedUrl(url, transformation) {
  return url.replace('/upload/', `/upload/${transformation}/`);
}
