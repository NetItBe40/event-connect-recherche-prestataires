import OpenAI from 'openai';
import { supabase } from "@/integrations/supabase/client";

const openai = new OpenAI({
  apiKey: '', // We'll set this dynamically
  dangerouslyAllowBrowser: true
});

export async function generateDescription(prompt: string) {
  try {
    console.log("Début de la récupération de la clé API");
    
    // Test de lecture de la table apikeys
    const { count, error: countError } = await supabase
      .from('apikeys')
      .select('*', { count: 'exact', head: true });
    
    console.log("Nombre d'entrées dans la table apikeys:", count);
    if (countError) {
      console.error("Erreur lors du comptage:", countError);
    }

    const { data: apiKeys, error } = await supabase
      .from('apikeys')
      .select('apikey')
      .eq('provider', 'openai')
      .single();

    if (error) {
      console.error("Erreur Supabase détaillée:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error("Erreur lors de la récupération de la clé API");
    }

    if (!apiKeys || !apiKeys.apikey) {
      console.error("Aucune clé API ou clé vide trouvée");
      throw new Error("Aucune clé API OpenAI trouvée dans la base de données");
    }

    console.log("Clé API trouvée:", apiKeys.apikey.substring(0, 5) + "...");
    console.log("Clé API OpenAI récupérée avec succès");
    
    openai.apiKey = apiKeys.apikey;

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
    console.error("Erreur lors de la génération de la description:", error);
    
    if (error?.status === 401) {
      throw new Error("Clé API invalide. Veuillez vérifier votre clé API OpenAI.");
    }
    
    throw error;
  }
}