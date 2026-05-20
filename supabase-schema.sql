create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  item text not null,
  category text,
  booking_date date,
  guests integer not null default 1,
  phone text not null,
  amount integer not null,
  payment_status text not null default 'pending',
  merchant_request_id text,
  checkout_request_id text,
  mpesa_response jsonb
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  channel text not null,
  subject text,
  message text,
  item text,
  email text,
  phone text
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
