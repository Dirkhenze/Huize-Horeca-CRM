import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { products, company_id } = await req.json();

    if (!products || !Array.isArray(products)) {
      return new Response(
        JSON.stringify({ error: 'Invalid products data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const productsToInsert = products.map((product: any) => ({
      company_id: company_id || '00000000-0000-0000-0000-000000000001',
      artikelnummer: product.artikelnummer || product.Artikelnummer || '',
      sku: product.artikelnummer || product.Artikelnummer || '',
      eenheid: product.eenheid || product.Eenheid || '',
      unit: product.eenheid || product.Eenheid || 'stuk',
      artikelnaam: product.artikelnaam || product.Artikelnaam || product.Omschrijving || '',
      name: product.artikelnaam || product.Artikelnaam || product.Omschrijving || '',
      inhoud: product.inhoud || product.Inhoud || '',
      kostprijs: parseFloat(product.kostprijs || product.Kostprijs || '0') || 0,
      cost_price: parseFloat(product.kostprijs || product.Kostprijs || '0') || 0,
      verkoopprijs_1: parseFloat(product.verkoopprijs_1 || product['Verkoopprijs 1'] || '0') || 0,
      list_price: parseFloat(product.verkoopprijs_1 || product['Verkoopprijs 1'] || '0') || 0,
      verkoopprijs_2: parseFloat(product.verkoopprijs_2 || product['Verkoopprijs 2'] || '0') || 0,
      verkoopprijs_3: parseFloat(product.verkoopprijs_3 || product['Verkoopprijs 3'] || '0') || 0,
      category: product.category || product.Categorie || product.Groep || '',
      supplier: product.supplier || product.Leverancier || '',
      barcode: product.barcode || product.Barcode || product.EAN || '',
      description: product.description || product.Omschrijving || '',
      active: true,
    }));

    const { data, error } = await supabase
      .from('products')
      .upsert(productsToInsert, {
        onConflict: 'artikelnummer,company_id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Error inserting products:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: data?.length || 0,
        products: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
