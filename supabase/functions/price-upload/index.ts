import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PriceRow {
  sku: string;
  net_price: number;
  currency?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: userCompanies } = await supabase
      .from("user_companies")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!userCompanies) {
      return new Response(
        JSON.stringify({ error: "No company associated with user" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const companyId = userCompanies.company_id;
    const body = await req.json();
    const { prices, priceListName } = body as {
      prices: PriceRow[];
      priceListName: string;
    };

    if (!prices || !Array.isArray(prices) || prices.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid prices data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: priceList, error: priceListError } = await supabase
      .from("price_lists")
      .insert({
        company_id: companyId,
        name: priceListName || `Upload ${new Date().toISOString()}`,
        valid_from: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (priceListError) {
      return new Response(
        JSON.stringify({ error: priceListError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const itemsToInsert = [];
    const warnings = [];

    for (const row of prices) {
      if (!row.sku || !row.net_price) {
        warnings.push(`Skipped row with missing SKU or price`);
        continue;
      }

      const { data: product } = await supabase
        .from("products")
        .select("id, sku, list_price, cost_price")
        .eq("company_id", companyId)
        .eq("sku", row.sku)
        .single();

      if (!product) {
        warnings.push(`Product with SKU ${row.sku} not found`);
        continue;
      }

      if (product.list_price && row.net_price > product.list_price) {
        warnings.push(
          `Warning: Price for ${row.sku} (${row.net_price}) exceeds list price (${product.list_price})`
        );
      }

      if (product.cost_price && row.net_price < product.cost_price) {
        warnings.push(
          `Warning: Price for ${row.sku} (${row.net_price}) is below cost price (${product.cost_price})`
        );
      }

      itemsToInsert.push({
        price_list_id: priceList.id,
        product_id: product.id,
        net_price: row.net_price,
        currency: row.currency || "EUR",
      });
    }

    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("price_list_items")
        .insert(itemsToInsert);

      if (insertError) {
        return new Response(
          JSON.stringify({ error: insertError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        priceListId: priceList.id,
        itemsImported: itemsToInsert.length,
        warnings,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
