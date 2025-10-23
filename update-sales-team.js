import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tfgttzedzrcehyxxyjwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ3R0emVkenJjZWh5eHh5andxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzYxOTYsImV4cCI6MjA3Njc1MjE5Nn0.xV2mveCjqzPxcVLBP6tccHSYtaM1ZK0OzQbjv5bma5o';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const correctSalesTeam = [
  { employee_number: 'AM-001', first_name: 'Arie', last_name: 'Ouwerkerk', email: 'arie.ouwerkerk@huizehoreca.nl' },
  { employee_number: 'AM-002', first_name: 'Bobby', last_name: 'Klein', email: 'bobby.klein@huizehoreca.nl' },
  { employee_number: 'AM-003', first_name: 'Dirk', last_name: 'Henze', email: 'dirk.henze@huizehoreca.nl' },
  { employee_number: 'AM-004', first_name: 'Emile', last_name: 'Metekohy', email: 'emile.metekohy@huizehoreca.nl' },
  { employee_number: 'AM-005', first_name: 'Maarten', last_name: 'Baas', email: 'maarten.baas@huizehoreca.nl' },
  { employee_number: 'AM-006', first_name: 'Patrick', last_name: 'Wiersema', email: 'patrick.wiersema@huizehoreca.nl' },
  { employee_number: 'AM-007', first_name: 'Paul', last_name: 'van Bennekom', email: 'paul.vanbennekom@huizehoreca.nl' },
  { employee_number: 'AM-008', first_name: 'Ron', last_name: 'van der Wurf', email: 'ron.vanderwurf@huizehoreca.nl' },
];

async function updateSalesTeam() {
  console.log('🔄 Updating sales team...');

  const companyId = '00000000-0000-0000-0000-000000000001';

  // Step 1: Delete all existing sales team members
  console.log('🗑️  Deleting existing sales team members...');
  const { error: deleteError } = await supabase
    .from('sales_team')
    .delete()
    .eq('company_id', companyId);

  if (deleteError) {
    console.error('❌ Error deleting:', deleteError);
    return;
  }

  console.log('✅ Deleted existing members');

  // Step 2: Insert correct sales team
  console.log('➕ Inserting correct sales team...');

  const membersToInsert = correctSalesTeam.map(member => ({
    company_id: companyId,
    employee_number: member.employee_number,
    first_name: member.first_name,
    last_name: member.last_name,
    email: member.email,
    phone: null,
    team_name: 'Sales',
    function_title: 'Account Manager',
    is_active: true
  }));

  const { data, error: insertError } = await supabase
    .from('sales_team')
    .insert(membersToInsert)
    .select();

  if (insertError) {
    console.error('❌ Error inserting:', insertError);
    return;
  }

  console.log('✅ Inserted', data.length, 'members:');
  data.forEach(member => {
    console.log(`   - ${member.first_name} ${member.last_name} (${member.employee_number})`);
  });

  // Step 3: Verify
  const { data: verifyData, error: verifyError } = await supabase
    .from('sales_team')
    .select('*')
    .eq('company_id', companyId)
    .order('employee_number');

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError);
    return;
  }

  console.log('\n✅ Verification: Found', verifyData.length, 'members in database');
  console.log('\n🎉 Sales team updated successfully!');
}

updateSalesTeam();
