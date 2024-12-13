import { supabase } from "@/integrations/supabase/client";

export async function fetchSocialMediaData(website: string) {
  console.log("🔍 Démarrage de la recherche pour le site web:", website);

  // S'assurer que le site web inclut le protocole
  const normalizedWebsite = website.startsWith('http') ? website : `https://${website}`;
  console.log("🌐 URL normalisée:", normalizedWebsite);

  try {
    console.log("📡 Appel de l'API email-socials avec le site web:", normalizedWebsite);
    
    const response = await fetch("https://api.scrapetable.com/website/email-socials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "333560f1da2bc2c0fd39bfd3f4e1567b9b208d9ace5945433a3e1a75a5232657",
      },
      body: JSON.stringify({
        websites: [normalizedWebsite],
        flatten: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur API:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✨ Résultats de l'API email-socials:", result);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      console.warn("⚠️ Aucun résultat trouvé");
      return null;
    }

    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'appel API:", error);
    throw error;
  }
}