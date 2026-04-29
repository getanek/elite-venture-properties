-- Contract Renewal Notifier schema
create extension if not exists "uuid-ossp";

create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  renter_name text not null,
  renter_email text not null,
  property text,
  start_date date,
  end_date date not null,
  pdf_path text,
  notes text,
  status text default 'active', -- active | renewed | expired | cancelled
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists contracts_end_date_idx on contracts(end_date);
create index if not exists contracts_status_idx on contracts(status);

create table if not exists contract_notifications (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references contracts(id) on delete cascade,
  days_before int not null,
  sent_at timestamptz default now(),
  channel text default 'email',
  recipient text,
  unique (contract_id, days_before, recipient)
);

-- Storage bucket for contract PDFs (run separately in Supabase dashboard or via CLI):
-- insert into storage.buckets (id, name, public) values ('contracts', 'contracts', false);
