-- SUKUMA! casework schema. Apply only to the approved development branch after review.
-- Never run against the default/production branch without explicit approval.
CREATE TABLE IF NOT EXISTS public.sukuma_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  title varchar(180) NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 180),
  details text NOT NULL DEFAULT '' CHECK (length(details) <= 2000),
  category text NOT NULL DEFAULT 'Other' CHECK (category IN ('Water','Sanitation','Roads & potholes','Electricity','Waste collection','Public safety','Public facilities','Other')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','in_progress','escalated','resolved','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS sukuma_cases_owner_updated_idx ON public.sukuma_cases (owner_id, updated_at DESC, id DESC);
CREATE TABLE IF NOT EXISTS public.sukuma_case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.sukuma_cases(id) ON DELETE CASCADE,
  owner_id text NOT NULL,
  actor_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('created','status_changed')),
  from_status text CHECK (from_status IS NULL OR from_status IN ('open','acknowledged','in_progress','escalated','resolved','closed')),
  to_status text NOT NULL CHECK (to_status IN ('open','acknowledged','in_progress','escalated','resolved','closed')),
  note varchar(240) NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((event_type = 'created' AND from_status IS NULL AND to_status = 'open') OR (event_type = 'status_changed' AND from_status IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS sukuma_case_events_case_created_idx ON public.sukuma_case_events (case_id, created_at ASC, id ASC);
CREATE INDEX IF NOT EXISTS sukuma_case_events_owner_created_idx ON public.sukuma_case_events (owner_id, created_at DESC);
