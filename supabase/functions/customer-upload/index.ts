import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { customers } = await req.json();

    if (!Array.isArray(customers) || customers.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid customers array" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const firstCustomer = customers[0];
    const companyId = firstCustomer.company_id;

    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .maybeSingle();

    if (!existingCompany) {
      const { error: companyError } = await supabase
        .from("companies")
        .insert({
          id: companyId,
          name: "Demo Bedrijf",
        });

      if (companyError) {
        return new Response(
          JSON.stringify({ error: `Company creation failed: ${companyError.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const results = {
      success: 0,
      errors: [] as string[],
    };

    for (const customer of customers) {
      try {
        const { data: existing } = await supabase
          .from("customers")
          .select("id")
          .eq("company_id", customer.company_id)
          .eq("customer_number", customer.customer_number)
          .maybeSingle();

        let error;
        if (existing) {
          const result = await supabase
            .from("customers")
            .update(customer)
            .eq("id", existing.id);
          error = result.error;
        } else {
          const result = await supabase
            .from("customers")
            .insert(customer);
          error = result.error;
        }

        if (error) {
          results.errors.push(`Klant ${customer.customer_number}: ${error.message}`);
        } else {
          results.success++;
        }
      } catch (err: any) {
        results.errors.push(`Klant ${customer.customer_number}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
