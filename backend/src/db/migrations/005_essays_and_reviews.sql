-- Reshapes `content` for the two kinds of submission made on the /add page:
--   essay  — title, body, subsection
--   review — title (the review's own title), item_title + item_author (what is being reviewed), body
-- Both carry:
--   id           — unique across all content (1, 2, 3, ... whatever the kind)
--   number       — counts up per kind: Essay 1, Essay 2, ... and separately Review 1, Review 2, ...
--   published_on — month and year of publication, stored as the first day of that month
-- The table had no rows when this was written, so no existing data needs converting.

ALTER TABLE content DROP CONSTRAINT content_kind_check;
ALTER TABLE content ADD CONSTRAINT content_kind_check CHECK (kind IN ('essay', 'review'));

ALTER TABLE content RENAME COLUMN author TO item_author;
ALTER TABLE content ADD COLUMN item_title text;
ALTER TABLE content ADD COLUMN subsection text
  CHECK (subsection IN ('archaeology', 'fieldwork', 'art history'));
ALTER TABLE content ADD COLUMN published_on date NOT NULL
  CHECK (extract(day FROM published_on) = 1);
ALTER TABLE content ADD COLUMN number integer NOT NULL;
ALTER TABLE content ADD CONSTRAINT content_kind_number_key UNIQUE (kind, number);

-- Each kind has its own fields filled in, and only those.
ALTER TABLE content ADD CONSTRAINT content_fields_check CHECK (
  (kind = 'essay'  AND subsection IS NOT NULL AND item_title IS NULL AND item_author IS NULL) OR
  (kind = 'review' AND subsection IS NULL AND item_title IS NOT NULL AND item_author IS NOT NULL)
);
