-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Booking settings (single row)
CREATE TABLE public.booking_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  timezone text NOT NULL DEFAULT 'Europe/Rome',
  slot_duration_minutes integer NOT NULL DEFAULT 30,
  buffer_minutes integer NOT NULL DEFAULT 15,
  max_bookings_per_day integer NOT NULL DEFAULT 6,
  min_notice_hours integer NOT NULL DEFAULT 12,
  booking_horizon_days integer NOT NULL DEFAULT 30,
  meeting_type text NOT NULL DEFAULT 'Online consultation',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.booking_settings TO authenticated;
GRANT UPDATE ON public.booking_settings TO authenticated;
GRANT ALL ON public.booking_settings TO service_role;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read booking settings"
ON public.booking_settings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update booking settings"
ON public.booking_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.booking_settings (id) VALUES (true);

-- Weekly availability
CREATE TABLE public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday integer NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (weekday, start_time, end_time)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_rules TO authenticated;
GRANT ALL ON public.availability_rules TO service_role;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage availability"
ON public.availability_rules FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.availability_rules (weekday, start_time, end_time) VALUES
  (1, '09:30', '13:00'), (1, '14:30', '18:00'),
  (2, '09:30', '13:00'), (2, '14:30', '18:00'),
  (3, '09:30', '13:00'), (3, '14:30', '18:00'),
  (4, '09:30', '13:00'), (4, '14:30', '18:00'),
  (5, '09:30', '13:00'), (5, '14:30', '17:00');

-- Blocked dates
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_on date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_dates TO authenticated;
GRANT ALL ON public.blocked_dates TO service_role;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage blocked dates"
ON public.blocked_dates FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookings
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_start timestamptz NOT NULL,
  slot_end timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  full_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  website text,
  notes text,
  business_type text,
  automation_goals text[] NOT NULL DEFAULT '{}',
  enquiry_sources text[] NOT NULL DEFAULT '{}',
  tools text[] NOT NULL DEFAULT '{}',
  tools_other text,
  consent boolean NOT NULL DEFAULT false,
  timezone text,
  manage_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX bookings_active_slot_unique
  ON public.bookings (slot_start)
  WHERE status = 'confirmed';

CREATE INDEX bookings_slot_start_idx ON public.bookings (slot_start);

GRANT SELECT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read bookings"
ON public.bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));