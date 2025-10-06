import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  company_id: string | null;
  contact_id: string | null;
  title: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expected_close_date: string | null;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  title: string;
  description: string;
  company_id: string | null;
  contact_id: string | null;
  deal_id: string | null;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}
