import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateDescription(prompt: string) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

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
}