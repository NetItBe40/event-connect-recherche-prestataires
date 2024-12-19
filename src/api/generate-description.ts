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
        model: "gpt-4o",
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

      return completion.choices[0].message.content;
    } catch (openaiError: any) {
      console.error("Erreur OpenAI détaillée:", openaiError);
      
      if (openaiError?.status === 429) {
        const errorBody = JSON.parse(openaiError.body);
        const waitTime = errorBody?.error?.message?.match(/try again in (\d+\.?\d*)s/)?.[1];
        
        if (waitTime && retryCount < 3) {
          console.log(`Attente de ${waitTime}s avant de réessayer...`);
          await wait(Math.ceil(parseFloat(waitTime) * 1000));
          return generateDescription(prompt, retryCount + 1);
        }
        
        if (errorBody?.error?.message?.includes("quota")) {
          throw new Error("La limite de quota OpenAI a été atteinte. Veuillez vérifier votre plan et vos détails de facturation sur OpenAI.");
        } else {
          throw new Error("Trop de requêtes. Veuillez réessayer dans quelques instants.");
        }
      }
      
      throw openaiError;
    }
  } catch (error: any) {
    console.error("Erreur lors de la génération de la description:", error);
    throw error;
  }
}