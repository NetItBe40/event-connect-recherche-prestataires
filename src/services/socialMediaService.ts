import { supabase } from "@/integrations/supabase/client";

export async function fetchSocialMediaData(website: string) {
  console.log("🔍 Fetching social media data for website:", website);

  // Ensure the website includes the protocol
  const normalizedWebsite = website.startsWith('http') ? website : `https://${website}`;
  console.log("🌐 Normalized website URL:", normalizedWebsite);

  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('apikeys')
    .select('apikey')
    .eq('provider', 'scrapetable')
    .single();

  if (apiKeyError || !apiKeyData?.apikey) {
    console.error("❌ Error fetching API key:", apiKeyError);
    throw new Error("Impossible de récupérer la clé API");
  }

  console.log("✅ API key retrieved successfully");
  console.log("📡 Calling email-socials API with website:", normalizedWebsite);

  const response = await fetch("https://api.scrapetable.com/website/email-socials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKeyData.apikey,
    },
    body: JSON.stringify({
      websites: [normalizedWebsite],
      flatten: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ API Error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error("Erreur lors de la récupération des données");
  }

  const result = await response.json();
  console.log("✨ Email-socials API results:", result);
  return result;
}