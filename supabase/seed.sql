-- Demo data for Elite Venture Properties
-- Dates are relative to today so badges show realistic urgency

insert into contracts (renter_name, renter_email, property, start_date, end_date, notes, status) values
  ('Amira Al-Mansoori',  'amira.almansoori@example.com',  'Palm Jumeirah · Frond G · Villa 12',         current_date - interval '350 days', current_date + interval '5 days',   'Premium tenant. Renewal verbal-confirmed.', 'active'),
  ('James Whitford',     'james.whitford@example.com',    'Downtown · Burj Vista · Apt 2304',           current_date - interval '340 days', current_date + interval '12 days',  'Pending renewal terms negotiation.',         'active'),
  ('Sofia Petrova',      'sofia.petrova@example.com',     'Dubai Marina · Princess Tower · 5612',       current_date - interval '330 days', current_date + interval '21 days',  'Long-term tenant, 3rd renewal cycle.',       'active'),
  ('Hassan Khoury',      'hassan.khoury@example.com',     'Emirates Hills · Villa 47',                  current_date - interval '300 days', current_date + interval '45 days',  'High-value contract — VIP handling.',        'active'),
  ('Eleanor Ashworth',   'eleanor.ashworth@example.com',  'Jumeirah Bay · Bulgari Residence · 1102',    current_date - interval '280 days', current_date + interval '90 days',  'New tenant, references verified.',           'active'),
  ('Marco Bianchi',      'marco.bianchi@example.com',     'DIFC · Index Tower · Office 4408',           current_date - interval '200 days', current_date + interval '180 days', 'Commercial lease.',                          'active'),
  ('Yuki Tanaka',        'yuki.tanaka@example.com',       'Bluewaters · Bay Residences · Apt 808',      current_date - interval '380 days', current_date - interval '3 days',   'Lapsed — awaiting renter response.',         'active'),
  ('Olivia Sterling',    'olivia.sterling@example.com',   'JBR · Sadaf 3 · Apt 2104',                   current_date - interval '720 days', current_date - interval '365 days', 'Renewed last cycle.',                        'renewed')
on conflict do nothing;
