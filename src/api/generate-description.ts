import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '', // We'll set this dynamically
  dangerouslyAllowBrowser: true
});

export async function generateDescription(prompt: string) {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error("OpenAI API key not configured. Please add your API key in the settings.");
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-')) {
      throw new Error("Invalid API key format. The key should start with 'sk-'");
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
      throw new Error("Invalid API key. Please check your OpenAI API key and try again.");
    }
    
    // Re-throw the error with a more user-friendly message
    console.error("Erreur lors de la génération de la description:", error);
    throw new Error(error.message || "Une erreur est survenue lors de la génération de la description");
  }
}