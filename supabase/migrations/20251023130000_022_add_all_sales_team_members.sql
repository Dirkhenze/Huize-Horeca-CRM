/*
  # Voeg Alle Sales Team Members Toe

  1. Data
    - Voegt alle 8 accountmanagers direct toe aan sales_team tabel

  2. Team Members
    - Arie Ouwerkerk
    - Bobby Klein
    - Dirk Henze
    - Emile Metekohy
    - Maarten Baas
    - Patrick Wiersema
    - Paul van Bennekom
    - Ron van der Wurf
*/

-- Voeg alle accountmanagers toe aan sales_team
INSERT INTO sales_team (
  id,
  company_id,
  first_name,
  last_name,
  email,
  phone,
  mobile,
  role,
  function_title,
  employee_number,
  is_active
) VALUES
  (
    'am-001',
    '00000000-0000-0000-0000-000000000001',
    'Arie',
    'Ouwerkerk',
    'arie.ouwerkerk@huizehoreca.nl',
    '0612345601',
    '0612345601',
    'sales',
    'Accountmanager',
    'HH001',
    true
  ),
  (
    'am-002',
    '00000000-0000-0000-0000-000000000001',
    'Bobby',
    'Klein',
    'bobby.klein@huizehoreca.nl',
    '0612345603',
    '0612345603',
    'sales',
    'Accountmanager',
    'HH003',
    true
  ),
  (
    'am-003',
    '00000000-0000-0000-0000-000000000001',
    'Dirk',
    'Henze',
    'dirk.henze@huizehoreca.nl',
    '0612345604',
    '0612345604',
    'sales',
    'Accountmanager',
    'HH004',
    true
  ),
  (
    'am-004',
    '00000000-0000-0000-0000-000000000001',
    'Emile',
    'Metekohy',
    'emile.metekohy@huizehoreca.nl',
    '0612345605',
    '0612345605',
    'sales',
    'Accountmanager',
    'HH005',
    true
  ),
  (
    'am-005',
    '00000000-0000-0000-0000-000000000001',
    'Maarten',
    'Baas',
    'maarten.baas@huizehoreca.nl',
    '0612345606',
    '0612345606',
    'sales',
    'Accountmanager',
    'HH006',
    true
  ),
  (
    'am-006',
    '00000000-0000-0000-0000-000000000001',
    'Patrick',
    'Wiersema',
    'patrick.wiersema@huizehoreca.nl',
    '0612345607',
    '0612345607',
    'sales',
    'Accountmanager',
    'HH007',
    true
  ),
  (
    'am-007',
    '00000000-0000-0000-0000-000000000001',
    'Paul',
    'van Bennekom',
    'paul.bennekom@huizehoreca.nl',
    '0612345608',
    '0612345608',
    'sales',
    'Accountmanager',
    'HH008',
    true
  ),
  (
    'am-008',
    '00000000-0000-0000-0000-000000000001',
    'Ron',
    'van der Wurf',
    'ron.wurf@huizehoreca.nl',
    '0612345609',
    '0612345609',
    'sales',
    'Accountmanager',
    'HH009',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  mobile = EXCLUDED.mobile,
  function_title = EXCLUDED.function_title,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Verificatie
SELECT
  'Sales Team members toegevoegd' as status,
  COUNT(*) as totaal_members
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001';
