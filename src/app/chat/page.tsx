"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your OptiMind AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I understand your question. Based on my analysis, I can help you with that. Let me provide you with a comprehensive answer that addresses your specific needs.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                💬
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
                <p className="text-sm text-muted-foreground">Powered by OptiMind AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Online</Badge>
              <Button variant="outline" size="sm">New Chat</Button>
              <Button size="sm" onClick={() => window.history.back()}>Back</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/5 p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                📝 Generate Content
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                📊 Analyze Data
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                🔍 Smart Search
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                💻 Code Assistant
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold">Recent Chats</h3>
            <div className="space-y-2 mt-2">
              <div className="p-2 rounded hover:bg-muted/50 cursor-pointer text-sm">
                Project Planning
              </div>
              <div className="p-2 rounded hover:bg-muted/50 cursor-pointer text-sm">
                Data Analysis
              </div>
              <div className="p-2 rounded hover:bg-muted/50 cursor-pointer text-sm">
                Content Strategy
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">
                      {message.type === "user" ? "You" : "OptiMind AI"}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-4 rounded-lg max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span className="text-sm">OptiMind AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                Send
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>Powered by OptiMind AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}