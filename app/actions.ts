"use server";

export async function generateRomanticContent(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://valentine-bhoomi.vercel.app", // Optional
        "X-Title": "Valentine Bhoomi", // Optional
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Using a reliable model
        messages: [
          {
            role: "system",
            content: "You are a romantic AI assistant helping a user express their love to Bhoomi. Your tone is deeply romantic, poetic, and sincere. Keep responses concise but very touching."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "My heart is so full of love for you that words fail me right now. But know that you are my everything. ❤️";
  }
}
