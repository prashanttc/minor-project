// hooks/use-chat-bot.ts
import { useState } from "react"

export interface Message {
  role: "user" | "bot"
  content: string
}

export function useChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! Ask me anything about books 📚" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content })
      })

      const data = await res.json()
      const botReply: Message = { role: "bot", content: data.reply || "🤖 Hmm... I couldn't figure that out." }

      setMessages(prev => [...prev, botReply])
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "⚠️ Error talking to the assistant." }])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit
  }
}
