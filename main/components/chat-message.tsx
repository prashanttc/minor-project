// components/chat-message.tsx
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  message: {
    role: "user" | "bot"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser ? "flex-row-reverse self-end" : "")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
            : "bg-gradient-to-br from-muted to-muted/80 text-foreground"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 shadow-sm max-w-[80%] whitespace-pre-wrap",
          isUser
            ? "rounded-tr-none bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
            : "rounded-tl-none bg-gradient-to-br from-muted to-muted/80 border border-muted/50"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
