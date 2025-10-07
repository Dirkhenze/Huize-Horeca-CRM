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

    console.log(`Processing ${products.length} products for company ${company_id}`);

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

    const results = [];
    const errors = [];

    for (const product of productsToInsert) {
      const { data, error } = await supabase
        .from('products')
        .upsert(product, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting product:', product.artikelnummer, error);
        errors.push({ product: product.artikelnummer, error: error.message });
      } else {
        results.push(data);
      }
    }

    console.log(`Successfully inserted ${results.length} products, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: results.length,
        products: results,
        errors: errors.length > 0 ? errors : undefined
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
