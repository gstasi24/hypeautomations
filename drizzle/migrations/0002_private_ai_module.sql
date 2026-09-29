-- Hype Private AI: customers, orders, payments, admin notes, audit placeholder.
CREATE TABLE public.pai_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  first_name text, last_name text, email text,
  company_name text, phone text, country text, website text,
  use_case text,
  acknowledged boolean NOT NULL DEFAULT false,
  account_status text NOT NULL DEFAULT 'account_created',
  setup_status text NOT NULL DEFAULT 'not_started',
  assigned_staff text, onboarding_notes text, target_go_live date,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.pai_customers TO authenticated;
GRANT ALL ON public.pai_customers TO service_role;
ALTER TABLE public.pai_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own customer read" ON public.pai_customers FOR SELECT TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "Own customer insert" ON public.pai_customers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own or admin customer update" ON public.pai_customers FOR UPDATE TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(),'admin'));

CREATE TABLE public.pai_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier text NOT NULL CHECK (tier IN ('essential','advanced','pro')),
  payment_model text NOT NULL CHECK (payment_model IN ('one_time','monthly')),
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  maintenance_cents integer,
  status text NOT NULL DEFAULT 'order_review',
  payment_status text NOT NULL DEFAULT 'unpaid',
  provider text,
  provider_customer_id text, provider_checkout_id text, provider_payment_id text, provider_subscription_id text,
  purchased_at timestamptz, next_billing_at timestamptz, maintenance_renewal_at timestamptz,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.pai_orders TO authenticated;
GRANT ALL ON public.pai_orders TO service_role;
ALTER TABLE public.pai_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own order read" ON public.pai_orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "Own order insert" ON public.pai_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own order update" ON public.pai_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pai_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.pai_orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'initial',
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  status text NOT NULL,
  provider text NOT NULL,
  provider_event_id text UNIQUE,
  provider_reference text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pai_payments TO authenticated;
GRANT ALL ON public.pai_payments TO service_role;
ALTER TABLE public.pai_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own payment read" ON public.pai_payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(),'admin'));

CREATE TABLE public.pai_admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_user_id uuid NOT NULL,
  author_id uuid NOT NULL,
  author_email text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.pai_admin_notes TO authenticated;
GRANT ALL ON public.pai_admin_notes TO service_role;
ALTER TABLE public.pai_admin_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read notes" ON public.pai_admin_notes FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins add notes" ON public.pai_admin_notes FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(),'admin') AND author_id = auth.uid());

-- Phase-two placeholder: audit log for future agent actions. No behavior yet.
CREATE TABLE public.pai_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  actor text NOT NULL,
  action text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pai_audit_logs TO authenticated;
GRANT ALL ON public.pai_audit_logs TO service_role;
ALTER TABLE public.pai_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own audit read" ON public.pai_audit_logs FOR SELECT TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(),'admin'));

-- Guards: customers cannot change internal state; prices are computed server-side; payment fields only by service role.
CREATE OR REPLACE FUNCTION private.pai_guard_customer() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF auth.role() = 'service_role' OR private.has_role(auth.uid(),'admin') THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.account_status := 'account_created'; NEW.setup_status := 'not_started';
    NEW.assigned_staff := NULL; NEW.onboarding_notes := NULL; NEW.target_go_live := NULL;
  ELSE
    NEW.account_status := OLD.account_status; NEW.setup_status := OLD.setup_status;
    NEW.assigned_staff := OLD.assigned_staff; NEW.onboarding_notes := OLD.onboarding_notes;
    NEW.target_go_live := OLD.target_go_live; NEW.user_id := OLD.user_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER pai_customers_guard BEFORE INSERT OR UPDATE ON public.pai_customers FOR EACH ROW EXECUTE FUNCTION private.pai_guard_customer();

CREATE OR REPLACE FUNCTION private.pai_guard_order() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF auth.role() = 'service_role' THEN RETURN NEW; END IF;
  NEW.amount_cents := CASE NEW.payment_model
    WHEN 'one_time' THEN CASE NEW.tier WHEN 'essential' THEN 69900 WHEN 'advanced' THEN 89900 ELSE 123900 END
    ELSE CASE NEW.tier WHEN 'essential' THEN 2900 WHEN 'advanced' THEN 4900 ELSE 9900 END END;
  NEW.maintenance_cents := CASE WHEN NEW.payment_model = 'one_time' THEN 25000 ELSE NULL END;
  NEW.currency := 'eur';
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'order_review'; NEW.payment_status := 'unpaid';
    NEW.provider := NULL; NEW.provider_customer_id := NULL; NEW.provider_checkout_id := NULL;
    NEW.provider_payment_id := NULL; NEW.provider_subscription_id := NULL;
    NEW.purchased_at := NULL; NEW.next_billing_at := NULL; NEW.maintenance_renewal_at := NULL;
  ELSE
    IF OLD.payment_status <> 'unpaid' THEN RAISE EXCEPTION 'Order is locked'; END IF;
    NEW.status := CASE WHEN NEW.status IN ('order_review','checkout_started') THEN NEW.status ELSE OLD.status END;
    NEW.payment_status := OLD.payment_status; NEW.provider := OLD.provider;
    NEW.provider_customer_id := OLD.provider_customer_id; NEW.provider_checkout_id := OLD.provider_checkout_id;
    NEW.provider_payment_id := OLD.provider_payment_id; NEW.provider_subscription_id := OLD.provider_subscription_id;
    NEW.purchased_at := OLD.purchased_at; NEW.next_billing_at := OLD.next_billing_at;
    NEW.maintenance_renewal_at := OLD.maintenance_renewal_at; NEW.user_id := OLD.user_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER pai_orders_guard BEFORE INSERT OR UPDATE ON public.pai_orders FOR EACH ROW EXECUTE FUNCTION private.pai_guard_order();
REVOKE EXECUTE ON FUNCTION private.pai_guard_customer() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION private.pai_guard_order() FROM PUBLIC, anon;
CREATE INDEX pai_orders_user_idx ON public.pai_orders(user_id);
CREATE INDEX pai_payments_order_idx ON public.pai_payments(order_id);
CREATE INDEX pai_notes_customer_idx ON public.pai_admin_notes(customer_user_id);