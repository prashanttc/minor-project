// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai"; // Importing the OpenAI library, which works for Nebius AI as well

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/", // Nebius AI base URL
  apiKey: process.env.NEBIUS_API_KEY, // Your Nebius API key
});

const prisma = new PrismaClient();

const SYSTEM_PROMPT = `
You are BookVerse, an intelligent and witty book assistant. 
Always reply concisely and clearly. 
Your goal is to recommend books, explain topics, summarize content, or guide users to explore genres and authors.
No fluff, no generic AI speak – sound human and insightful.
`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
    }

    const { message } = await req.json();
    const prompt = `${SYSTEM_PROMPT.trim()}\n\nUser: ${message}\nAssistant:`;

    // Call the Nebius AI model to generate a response
    const response = await client.chat.completions.create({
      model: "mistralai/Mistral-Nemo-Instruct-2407", // Use your Nebius model here
      messages: [
        {
          role: "system",
          content: "You are a helpful literary assistant that generates engaging book-related content.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const generatedText = response.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      return NextResponse.json({ reply: "🤖 Sorry, I didn’t get that." }, { status: 500 });
    }

    return NextResponse.json({ reply: generatedText });
  } catch (error) {
    console.error("Error in generating response:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
