import OpenAI from 'openai';

// Log the API key (masked for security)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
console.log('API Key available:', apiKey ? 'Yes (masked for security)' : 'No');

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: For production, it's better to use a backend proxy
});

export const generateText = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "No response generated";
  } catch (error) {
    console.error("Error generating text:", error);
    return `Error: ${error.message || "Unknown error occurred"}`;
  }
};

export const generateImage = async (prompt) => {
  try {
    console.log('Generating image with prompt:', prompt.substring(0, 50) + '...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    
    console.log('Image generation successful, URL:', response.data[0]?.url ? 'Received URL' : 'No URL received');
    return response.data[0]?.url;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
