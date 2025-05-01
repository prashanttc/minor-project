"use client"

import type React from "react"

import { useState } from "react"

export type Message = {
  role: "user" | "assistant"
  content: string
}

// Update the sample responses to include emojis and more engaging text
const SAMPLE_RESPONSES: Record<string, string[]> = {
  greeting: [
    "👋 Hello! How can I help you find your next favorite book today?",
    "✨ Welcome to BookVerse! I'm here to help with book recommendations and answer any questions you might have.",
    "📚 Hi there! Looking for a good read? I'd be happy to suggest some books based on your interests.",
  ],
  recommendation: [
    "📖 Based on your interests, I think you might enjoy 'The Midnight Library' by Matt Haig. It's a thought-provoking novel about the choices we make in life.",
    "🚀 Have you read 'Project Hail Mary' by Andy Weir? It's a fantastic sci-fi novel with great characters and an engaging plot.",
    "⚔️ For fantasy lovers, 'The Song of Achilles' by Madeline Miller is a beautiful retelling of Greek mythology that I highly recommend.",
  ],
  genre: [
    "🔍 We have a wide selection of genres including fiction, non-fiction, sci-fi, fantasy, romance, mystery, and more. What are you interested in?",
    "📊 Our most popular genres right now are fantasy, sci-fi, and contemporary fiction. Would you like recommendations from any of these?",
    "📚 We have an extensive collection across all major genres. Is there a specific genre you're looking for?",
  ],
  author: [
    "✍️ We have several books by that author. Their most popular work is currently featured in our New Releases section.",
    "🌟 That's a great author! We have their complete collection available both in physical copies and e-books.",
    "📅 That author has a new book coming out next month! Would you like to pre-order it?",
  ],
  price: [
    "💰 Our books range from $9.99 to $29.99, with special discounts for members.",
    "🏷️ We're currently running a buy-one-get-one-half-off promotion on selected titles.",
    "💸 E-books are typically priced 30% lower than physical copies, and we offer bundle deals as well.",
  ],
  delivery: [
    "🚚 We offer free shipping on orders over $35. Standard delivery takes 3-5 business days.",
    "⚡ Express delivery is available for $5.99 and will get your books to you within 1-2 business days.",
    "🏬 You can also choose our store pickup option at no additional cost.",
  ],
  fallback: [
    "🤔 I'm not sure I understand. Could you rephrase your question about books or our store?",
    "📚 I'm still learning about books. Could you ask me something else about our collection or services?",
    "❓ I don't have information on that yet. Is there something else I can help you with regarding books or our store?",
  ],
}

// Enhance the getResponse function to include emojis and more visually appealing text
function getResponse(message: string): string {
  message = message.toLowerCase()

  if (message.match(/hi|hello|hey|greetings/)) {
    return getRandomResponse("greeting")
  } else if (message.match(/recommend|suggestion|suggest|what should|good book/)) {
    return getRandomResponse("recommendation")
  } else if (message.match(/genre|category|type of book|fiction|non-fiction/)) {
    return getRandomResponse("genre")
  } else if (message.match(/author|writer|who wrote/)) {
    return getRandomResponse("author")
  } else if (message.match(/price|cost|how much|discount|sale/)) {
    return getRandomResponse("price")
  } else if (message.match(/delivery|shipping|ship|send|receive/)) {
    return getRandomResponse("delivery")
  } else {
    return getRandomResponse("fallback")
  }
}

// Get a random response from the category
function getRandomResponse(category: string): string {
  const responses = SAMPLE_RESPONSES[category] || SAMPLE_RESPONSES.fallback
  return responses[Math.floor(Math.random() * responses.length)]
}

export function useChatBot() {
  // Update the initial message to be more visually descriptive
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm the BookVerse assistant. How can I help you find your next great read today? I can recommend books, answer questions about authors, or help you find specific genres.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Get bot response
      const botResponse: Message = {
        role: "assistant",
        content: getResponse(userMessage.content),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}
