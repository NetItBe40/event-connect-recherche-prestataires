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
      .single();

    if (error) {
      throw new Error("Erreur lors de la récupération de la clé API");
    }

    if (!apiKeys?.apikey) {
      throw new Error("Clé API OpenAI non configurée dans la base de données");
    }

    const apiKey = apiKeys.apikey;

    // Validate API key format
    if (!apiKey.startsWith('sk-')) {
      throw new Error("Format de clé API invalide. La clé doit commencer par 'sk-'");
    }

    // Update the API key
    openai.apiKey = apiKey;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
      throw new Error("Clé API invalide. Veuillez vérifier votre clé API OpenAI.");
    }
    
    // Re-throw the error with a more user-friendly message
    console.error("Erreur lors de la génération de la description:", error);
    throw new Error(error.message || "Une erreur est survenue lors de la génération de la description");
  }
}