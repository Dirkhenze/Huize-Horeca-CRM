import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CustomerMetrics {
  current: {
    revenue: number;
    volume: number;
    orders: number;
  };
  previous: {
    revenue: number;
    volume: number;
    orders: number;
  };
  changes: {
    revenue_pct: number;
    volume_pct: number;
    orders_pct: number;
  };
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
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const prevFrom = url.searchParams.get("prevFrom");
    const prevTo = url.searchParams.get("prevTo");

    if (!customerId || !from || !to || !prevFrom || !prevTo) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: currentData, error: currentError } = await supabase.rpc(
      "get_customer_metrics",
      {
        p_customer_id: customerId,
        p_from_date: from,
        p_to_date: to,
      }
    );

    if (currentError) {
      const { data: fallbackCurrent } = await supabase
        .from("v_sales_by_customer_period")
        .select("*")
        .eq("customer_id", customerId)
        .gte("week", from)
        .lte("week", to);

      const current = fallbackCurrent || [];
      const totalRevenue = current.reduce((sum, row) => sum + (row.revenue_net || 0), 0);
      const totalVolume = current.reduce((sum, row) => sum + (row.volume_qty || 0), 0);
      const totalOrders = current.reduce((sum, row) => sum + (row.order_count || 0), 0);

      const { data: fallbackPrev } = await supabase
        .from("v_sales_by_customer_period")
        .select("*")
        .eq("customer_id", customerId)
        .gte("week", prevFrom)
        .lte("week", prevTo);

      const prev = fallbackPrev || [];
      const prevRevenue = prev.reduce((sum, row) => sum + (row.revenue_net || 0), 0);
      const prevVolume = prev.reduce((sum, row) => sum + (row.volume_qty || 0), 0);
      const prevOrders = prev.reduce((sum, row) => sum + (row.order_count || 0), 0);

      const metrics: CustomerMetrics = {
        current: {
          revenue: totalRevenue,
          volume: totalVolume,
          orders: totalOrders,
        },
        previous: {
          revenue: prevRevenue,
          volume: prevVolume,
          orders: prevOrders,
        },
        changes: {
          revenue_pct: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
          volume_pct: prevVolume > 0 ? ((totalVolume - prevVolume) / prevVolume) * 100 : 0,
          orders_pct: prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0,
        },
      };

      return new Response(JSON.stringify(metrics), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(currentData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
