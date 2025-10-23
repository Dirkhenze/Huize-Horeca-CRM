import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPersoon {
  naam: string;
  functie: string;
  telefoon: string;
  email: string;
}

interface KlantformulierData {
  lead_id: string;
  juridische_naam: string;
  handelsnaam: string;
  btw_nummer: string;
  kvk_nummer: string;
  factuur_email: string;
  betaalconditie: string;
  bezorgadres: string;
  iban: string;
  contactpersoon: string;
  contactpersonen: ContactPersoon[];
  opmerkingen_admin: string;
  bedrijfsnaam: string;
  plaats: string;
}

function generateEmailHTML(data: KlantformulierData): string {
  const contactPersonenHTML = data.contactpersonen
    .map((cp) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${cp.naam}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${cp.functie}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${cp.telefoon}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${cp.email}</td>
      </tr>
    `)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Klantaanvraag Uniconta</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-left: 4px solid #0066cc; padding: 20px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 10px 0; color: #0066cc;">Nieuwe Klantaanvraag</h1>
    <p style="margin: 0; color: #666;">Klantformulier voor Uniconta koppeling</p>
  </div>

  <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Bedrijfsgegevens</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px; font-weight: bold; width: 200px; background-color: #f8f9fa;">Bedrijfsnaam:</td>
      <td style="padding: 8px;">${data.bedrijfsnaam}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">Juridische naam:</td>
      <td style="padding: 8px;">${data.juridische_naam}</td>
    </tr>
    ${data.handelsnaam ? `
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">Handelsnaam:</td>
      <td style="padding: 8px;">${data.handelsnaam}</td>
    </tr>
    ` : ''}
    ${data.btw_nummer ? `
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">BTW nummer:</td>
      <td style="padding: 8px;">${data.btw_nummer}</td>
    </tr>
    ` : ''}
    ${data.kvk_nummer ? `
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">KvK nummer:</td>
      <td style="padding: 8px;">${data.kvk_nummer}</td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">Plaats:</td>
      <td style="padding: 8px;">${data.plaats}</td>
    </tr>
  </table>

  <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Factuurgegevens</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px; font-weight: bold; width: 200px; background-color: #f8f9fa;">Factuur email:</td>
      <td style="padding: 8px;">${data.factuur_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">IBAN:</td>
      <td style="padding: 8px;">${data.iban}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; background-color: #f8f9fa;">Betaalconditie:</td>
      <td style="padding: 8px;">${data.betaalconditie}</td>
    </tr>
  </table>

  <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Bezorgadres</h2>
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
    <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-wrap;">${data.bezorgadres}</pre>
  </div>

  <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Contactgegevens</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px; font-weight: bold; width: 200px; background-color: #f8f9fa;">Contactpersoon:</td>
      <td style="padding: 8px;">${data.contactpersoon}</td>
    </tr>
  </table>

  ${data.contactpersonen.length > 0 ? `
  <h3 style="color: #666; margin-top: 20px;">Extra contactpersonen</h3>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ddd;">
    <thead>
      <tr style="background-color: #0066cc; color: white;">
        <th style="padding: 10px; text-align: left;">Naam</th>
        <th style="padding: 10px; text-align: left;">Functie</th>
        <th style="padding: 10px; text-align: left;">Telefoon</th>
        <th style="padding: 10px; text-align: left;">Email</th>
      </tr>
    </thead>
    <tbody>
      ${contactPersonenHTML}
    </tbody>
  </table>
  ` : ''}

  ${data.opmerkingen_admin ? `
  <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Opmerkingen</h2>
  <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
    <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-wrap;">${data.opmerkingen_admin}</pre>
  </div>
  ` : ''}

  <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 30px; text-align: center;">
    <p style="margin: 0; color: #666; font-size: 14px;">
      <strong>Volgende stap:</strong> Maak een klantnummer aan in Uniconta en koppel deze terug in het CRM systeem.
    </p>
  </div>

  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
    <p>Deze email is automatisch gegenereerd vanuit het Huize Horeca CRM systeem.</p>
    <p>Lead ID: ${data.lead_id}</p>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: KlantformulierData = await req.json();

    const onderwerp = `Klantaanvraag Uniconta – ${data.bedrijfsnaam} – ${data.plaats}`;
    const htmlContent = generateEmailHTML(data);

    console.log('Email data prepared:', {
      to: 'info@huizehoreca.nl',
      subject: onderwerp,
      bedrijfsnaam: data.bedrijfsnaam
    });

    const responseData = {
      success: true,
      message: 'Email zou verstuurd zijn naar info@huizehoreca.nl',
      preview: {
        to: 'info@huizehoreca.nl',
        subject: onderwerp,
        lead_id: data.lead_id,
        bedrijfsnaam: data.bedrijfsnaam
      }
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error('Error processing email:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to process email',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
