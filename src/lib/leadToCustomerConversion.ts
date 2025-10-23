import { supabase } from './supabase';
import { Lead } from './types';

export interface ConversionResult {
  success: boolean;
  customerId?: string;
  error?: string;
}

export async function convertLeadToCustomer(lead: Lead): Promise<ConversionResult> {
  try {
    const customerData = {
      company_id: lead.company_id,
      
      lead_referentie: lead.temporary_customer_id,
      
      customer_number: `KLANT-${Date.now()}`,
      name: lead.company_name,
      customer_type: lead.customer_type,
      account_manager_id: lead.account_manager_id,
      
      address: lead.address,
      city: lead.city,
      postal_code: lead.postal_code,
      region: lead.region,
      country: 'NL',
      delivery_address: lead.delivery_address,
      
      delivery_preference_days: lead.delivery_preference_days,
      delivery_time_slots: lead.delivery_time_slots,
      delivery_instructions: lead.delivery_instructions,
      
      contact_person: lead.contact_person,
      email: lead.email,
      phone: lead.phone,
      contact_role: lead.contact_role,
      secondary_contact_name: lead.secondary_contact_name,
      secondary_contact_email: lead.secondary_contact_email,
      secondary_contact_phone: lead.secondary_contact_phone,
      
      iban: lead.iban,
      account_holder_name: lead.account_holder_name,
      payment_terms: lead.payment_terms,
      btw_number: lead.btw_number,
      
      assortment_interests: lead.assortment_interests,
      business_notes: lead.business_notes,
      
      is_active: true,
      uniconta_customer_id: lead.uniconta_customer_id,
      notes: lead.notes
    };

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();

    if (customerError) throw customerError;

    const { error: leadUpdateError } = await supabase
      .from('leads')
      .update({ status: 'Klant actief' })
      .eq('id', lead.id);

    if (leadUpdateError) throw leadUpdateError;

    return {
      success: true,
      customerId: customer.id
    };

  } catch (error) {
    console.error('Error converting lead to customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
