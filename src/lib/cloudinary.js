// Simple Cloudinary uploader helper
// Expects environment variables:
// REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  if (!file) throw new Error('No file provided');
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  // Debug log to help verify env vars are available at runtime
  try {
    // eslint-disable-next-line no-console
    console.log('Cloudinary env:', { cloudName, uploadPreset });
  } catch (e) {
    // ignore
  }

  if (!cloudName || !uploadPreset) {
    const msg = `Cloudinary not configured. Please set the following environment variables in a local .env.local file at the project root (do NOT commit):

REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

You must create an unsigned upload preset in your Cloudinary dashboard (Media Library -> Settings -> Upload -> Upload presets) and allow unsigned uploads for the preset.

After creating .env.local restart the dev server (npm start). See Cloudinary docs: https://cloudinary.com/documentation/upload_presets
`;
    // Fail fast with helpful instructions
    throw new Error(msg);
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);

  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    // Try to read the body without consuming the original response stream
    let bodyText = '';
    try {
      bodyText = await res.clone().text();
    } catch (err) {
      // If clone/text fails, fall back to a generic message
      bodyText = `(failed to read response body: ${err.message})`;
    }
    // Log for debugging
    // eslint-disable-next-line no-console
    console.error('Cloudinary upload failed', { status: res.status, body: bodyText });
    throw new Error(`Cloudinary upload failed: ${res.status} ${bodyText}`);
  }
  const data = await res.json();
  return data.secure_url || data.url;
}
