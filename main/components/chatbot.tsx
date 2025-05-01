"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChatMessage } from "./chat-message"
import { useChatBot } from "@/hooks/use-chat-bot"

export function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChatBot()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const toggleChat = () => setIsOpen(!isOpen)

  // Scroll to bottom of messages when new message is added
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:scale-105 transition-all duration-300"
        size="icon"
      >
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Bot className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Chat dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md"
          >
            <Card className="flex h-[500px] flex-col overflow-hidden border shadow-xl rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">BookVerse Assistant</h3>
                    <p className="text-xs text-primary-foreground/80">Online | Ready to help</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-primary-foreground hover:bg-white/20"
                  onClick={toggleChat}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-muted/30 to-transparent">
                <div className="flex flex-col gap-4">
                  {messages.map((message:any, index:number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <ChatMessage message={message} />
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-none bg-muted/80 backdrop-blur-sm p-3 text-muted-foreground shadow-sm">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-background p-3">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask about books, recommendations, etc..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 rounded-full border-primary/20 focus-visible:ring-primary/50 bg-muted/30"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300",
                      !input.trim() && "opacity-50",
                      input.trim() && !isLoading && "hover:scale-105",
                    )}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
