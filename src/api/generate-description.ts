import OpenAI from 'openai';
import { supabase } from "@/integrations/supabase/client";

const openai = new OpenAI({
  apiKey: '', // We'll set this dynamically
  dangerouslyAllowBrowser: true
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateDescription(prompt: string, retryCount = 0) {
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
        model: "gpt-3.5-turbo", // Utilisation d'un modèle valide d'OpenAI
        messages: [
          {
            role: "system",
            content: "Tu es un expert en rédaction de descriptions professionnelles pour des prestataires événementiels. Rédige une description engageante qui met en valeur les points forts de l'établissement, son ambiance et ses services. Ne mentionne pas explicitement l'optimisation SEO ou les mots-clés dans la description."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("La réponse d'OpenAI est vide");
      }

      return content;

    } catch (openaiError: any) {
      console.error("Erreur OpenAI détaillée:", openaiError);
      
      // Gestion spécifique de l'erreur de quota
      if (openaiError?.status === 429) {
        const errorBody = typeof openaiError.body === 'string' ? JSON.parse(openaiError.body) : openaiError.body;
        
        if (errorBody?.error?.type === 'insufficient_quota' || 
            errorBody?.error?.code === 'insufficient_quota' ||
            openaiError.message?.includes('quota')) {
          throw new Error("La clé API OpenAI a atteint sa limite de quota. Veuillez mettre à jour votre clé API dans les paramètres.");
        }
        
        // Pour les autres erreurs 429 (rate limiting), on utilise le backoff exponentiel
        const waitTime = 2000 * (retryCount + 1);
        if (retryCount < 3) {
          console.log(`Attente de ${waitTime/1000}s avant de réessayer...`);
          await wait(waitTime);
          return generateDescription(prompt, retryCount + 1);
        }
        
        throw new Error("Trop de requêtes. Veuillez réessayer dans quelques instants.");
      }
      
      throw new Error(`Erreur OpenAI: ${openaiError.message || "Erreur inconnue"}`);
    }
  } catch (error: any) {
    console.error("Erreur lors de la génération de la description:", error);
    throw error;
  }
}