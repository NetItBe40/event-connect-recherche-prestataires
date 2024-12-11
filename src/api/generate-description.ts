import OpenAI from 'openai';
import { supabase } from "@/integrations/supabase/client";

const openai = new OpenAI({
  apiKey: '', // We'll set this dynamically
  dangerouslyAllowBrowser: true
});

export async function generateDescription(prompt: string) {
  try {
    // Fetch API key from Supabase
    const { data: apiKeys, error } = await supabase
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'openai')
      .limit(1);

    if (error) {
      console.error("Erreur Supabase:", error);
      throw new Error("Erreur lors de la récupération de la clé API");
    }

    if (!apiKeys || apiKeys.length === 0) {
      console.error("Aucune clé API trouvée pour OpenAI");
      throw new Error("Aucune clé API OpenAI trouvée dans la base de données");
    }

    const apiKey = apiKeys[0].apikey;

    if (!apiKey) {
      console.error("La clé API est vide");
      throw new Error("La clé API OpenAI est vide dans la base de données");
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-')) {
      console.error("Format de clé API invalide");
      throw new Error("Format de clé API invalide. La clé doit commencer par 'sk-'");
    }

    console.log("Clé API OpenAI récupérée avec succès");
    
    // Update the API key
    openai.apiKey = apiKey;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Fixed typo here
      messages: [
        {
          role: "system",
          content: "Tu es un expert en rédaction de descriptions professionnelles pour des prestataires événementiels. Tu dois rédiger des descriptions claires, engageantes et optimisées pour le SEO."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error: any) {
    // Handle specific API errors
    if (error?.status === 401) {
      console.error("Erreur d'authentification OpenAI:", error);
      throw new Error("Clé API invalide. Veuillez vérifier votre clé API OpenAI.");
    }
    
    // Re-throw the error with a more user-friendly message
    console.error("Erreur lors de la génération de la description:", error);
    throw error;
  }
}