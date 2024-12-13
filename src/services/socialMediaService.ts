import { supabase } from "@/integrations/supabase/client";

export async function fetchSocialMediaData(website: string) {
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('apikeys')
    .select('apikey')
    .eq('provider', 'scrapetable')
    .single();

  if (apiKeyError || !apiKeyData?.apikey) {
    throw new Error("Impossible de récupérer la clé API");
  }

  console.log("Appel de l'API email-socials avec le site web:", website);

  const response = await fetch("https://api.scrapetable.com/website/email-socials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKeyData.apikey,
    },
    body: JSON.stringify({
      websites: [website],
      flatten: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erreur API:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error("Erreur lors de la récupération des données");
  }

  const result = await response.json();
  console.log("Résultats de l'API Email Socials:", result);
  return result;
}