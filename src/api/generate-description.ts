import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: '', // We'll set this dynamically
  dangerouslyAllowBrowser: true
});

export async function generateDescription(prompt: string) {
  try {
    // Fetch the OpenAI API key from Supabase
    const { data: { secret: openaiApiKey }, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

    if (secretError || !openaiApiKey) {
      throw new Error("OpenAI API key not configured. Please add your API key in Supabase secrets.");
    }

    // Update the API key
    openai.apiKey = openaiApiKey;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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
  } catch (error) {
    console.error("Erreur lors de la génération de la description:", error);
    throw error;
  }
}