-- Gallery photos. The image files live on Cloudinary; this table records where each one is.
--   public_id   — Cloudinary's id for the image
--   url         — the original image's https URL on Cloudinary (resized copies are made from it by changing the URL)
--   description — optional caption written on the polaroid, at most 50 characters
CREATE TABLE images (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id   text NOT NULL UNIQUE,
  url         text NOT NULL,
  width       integer NOT NULL,
  height      integer NOT NULL,
  description text CHECK (char_length(description) <= 50),
  created_at  timestamptz NOT NULL DEFAULT now()
);
