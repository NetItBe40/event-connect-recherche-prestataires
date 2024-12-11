import OpenAI from 'openai';
import { supabase } from "@/integrations/supabase/client";

const openai = new OpenAI({
  apiKey: '', // We'll set this dynamically
  dangerouslyAllowBrowser: true
});

export async function generateDescription(prompt: string) {
  try {
    console.log("Début de la récupération de la clé API");
    
    const { data: apiKeys, error } = await supabase
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'openai')
      .single();

    if (error) {
      console.error("Erreur Supabase:", error.message);
      throw new Error("Erreur lors de la récupération de la clé API");
    }

    if (!apiKeys || !apiKeys.apikey) {
      console.error("Aucune clé API ou clé vide trouvée");
      throw new Error("Aucune clé API OpenAI trouvée dans la base de données");
    }

    console.log("Clé API trouvée:", apiKeys.apikey.substring(0, 5) + "...");
    
    openai.apiKey = apiKeys.apikey;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Fixed model name
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
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (openaiError: any) {
      console.error("Erreur OpenAI détaillée:", openaiError);
      
      if (openaiError?.status === 429) {
        throw new Error("La limite de quota OpenAI a été atteinte. Veuillez vérifier votre plan et vos détails de facturation sur OpenAI.");
      }
      
      throw openaiError;
    }
  } catch (error: any) {
    console.error("Erreur lors de la génération de la description:", error);
    throw error;
  }
}