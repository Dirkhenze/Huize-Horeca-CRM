import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tfgttzedzrcehyxxyjwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ3R0emVkenJjZWh5eHh5andxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzYxOTYsImV4cCI6MjA3Njc1MjE5Nn0.xV2mveCjqzPxcVLBP6tccHSYtaM1ZK0OzQbjv5bma5o';

const supabase = createClient(supabaseUrl, supabaseKey);

const createTableSQL = `
-- Sales Team tabel aanmaken
CREATE TABLE IF NOT EXISTS sales_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  mobile text,

  role text DEFAULT 'sales',
  function_title text,
  team_name text,
  employee_number text,

  is_active boolean DEFAULT true,
  notes text,
  avatar_url text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_team_company ON sales_team(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_team_email ON sales_team(email);
CREATE INDEX IF NOT EXISTS idx_sales_team_active ON sales_team(is_active);

-- RLS Policies
ALTER TABLE sales_team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users to read sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to read sales_team"
  ON sales_team FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow all authenticated users to insert sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to insert sales_team"
  ON sales_team FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users to update sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to update sales_team"
  ON sales_team FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
`;

const salesTeamMembers = [
  {
    id: 'am-001',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Arie',
    last_name: 'Ouwerkerk',
    email: 'arie.ouwerkerk@huizehoreca.nl',
    phone: '0612345601',
    mobile: '0612345601',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH001',
    is_active: true
  },
  {
    id: 'am-002',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Bobby',
    last_name: 'Klein',
    email: 'bobby.klein@huizehoreca.nl',
    phone: '0612345603',
    mobile: '0612345603',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH003',
    is_active: true
  },
  {
    id: 'am-003',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Dirk',
    last_name: 'Henze',
    email: 'dirk.henze@huizehoreca.nl',
    phone: '0612345604',
    mobile: '0612345604',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH004',
    is_active: true
  },
  {
    id: 'am-004',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Emile',
    last_name: 'Metekohy',
    email: 'emile.metekohy@huizehoreca.nl',
    phone: '0612345605',
    mobile: '0612345605',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH005',
    is_active: true
  },
  {
    id: 'am-005',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Maarten',
    last_name: 'Baas',
    email: 'maarten.baas@huizehoreca.nl',
    phone: '0612345606',
    mobile: '0612345606',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH006',
    is_active: true
  },
  {
    id: 'am-006',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Patrick',
    last_name: 'Wiersema',
    email: 'patrick.wiersema@huizehoreca.nl',
    phone: '0612345607',
    mobile: '0612345607',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH007',
    is_active: true
  },
  {
    id: 'am-007',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Paul',
    last_name: 'van Bennekom',
    email: 'paul.bennekom@huizehoreca.nl',
    phone: '0612345608',
    mobile: '0612345608',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH008',
    is_active: true
  },
  {
    id: 'am-008',
    company_id: '00000000-0000-0000-0000-000000000001',
    first_name: 'Ron',
    last_name: 'van der Wurf',
    email: 'ron.wurf@huizehoreca.nl',
    phone: '0612345609',
    mobile: '0612345609',
    role: 'sales',
    function_title: 'Accountmanager',
    employee_number: 'HH009',
    is_active: true
  }
];

async function setupSalesTeam() {
  console.log('STAP 1: Sales Team tabel aanmaken...\n');

  const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });

  if (createError) {
    console.log('Probeer via directe RPC aanroep...');
  }

  console.log('\nSTAP 2: Accountmanagers toevoegen...\n');

  for (const member of salesTeamMembers) {
    const { data, error } = await supabase
      .from('sales_team')
      .upsert(member, { onConflict: 'id' })
      .select();

    if (error) {
      console.log(`❌ Fout bij ${member.first_name} ${member.last_name}:`, error.message);
    } else {
      console.log(`✅ ${member.first_name} ${member.last_name} toegevoegd (${member.employee_number})`);
    }
  }

  const { count, error } = await supabase
    .from('sales_team')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', '00000000-0000-0000-0000-000000000001');

  if (!error) {
    console.log(`\n✅ Totaal aantal Sales Team members: ${count}`);
  }
}

setupSalesTeam().then(() => {
  console.log('\n✅ Klaar! Alle accountmanagers zijn toegevoegd aan het Sales Team.');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Fout:', err.message);
  console.log('\nVoer de SQL handmatig uit in je Supabase Dashboard → SQL Editor');
  process.exit(1);
});
