import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }), 
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    const description = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ description }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    );
  }
}