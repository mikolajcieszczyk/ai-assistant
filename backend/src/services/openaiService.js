import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getCompletion = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to get AI response");
  }
};
