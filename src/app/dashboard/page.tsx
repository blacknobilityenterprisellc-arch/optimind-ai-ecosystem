"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                🧠
              </div>
              <h1 className="text-2xl font-bold">OptiMind AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Active</Badge>
              <Button variant="outline" size="sm">Settings</Button>
              <Button size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to Your AI Dashboard</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access all your AI-powered tools and services from one central location
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
                <div className="text-2xl">🤖</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+20% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Processed</CardTitle>
                <div className="text-2xl">📊</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.6 GB</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Models</CardTitle>
                <div className="text-2xl">⚡</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">All operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <div className="text-2xl">✅</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Excellent performance</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Tools Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">AI Tools & Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    💬
                  </div>
                  <CardTitle>AI Chat Assistant</CardTitle>
                  <CardDescription>
                    Chat with our advanced AI for help with tasks, questions, and creative work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Open Chat</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    🔍
                  </div>
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>
                    Analyze your data with AI-powered insights and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Analyze Data</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    ✨
                  </div>
                  <CardTitle>Content Generator</CardTitle>
                  <CardDescription>
                    Create high-quality content with AI assistance for blogs, emails, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate Content</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    🔎
                  </div>
                  <CardTitle>Smart Search</CardTitle>
                  <CardDescription>
                    Intelligent search with AI understanding of context and intent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Search</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    🎨
                  </div>
                  <CardTitle>AI Art Generator</CardTitle>
                  <CardDescription>
                    Create stunning images and artwork with advanced AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Art</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    📝
                  </div>
                  <CardTitle>Code Assistant</CardTitle>
                  <CardDescription>
                    Get help with coding, debugging, and software development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Code Assistant</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Recent Activity</h3>
            <Card>
              <CardHeader>
                <CardTitle>Latest AI Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        💬
                      </div>
                      <div>
                        <p className="font-medium">AI Chat Session</p>
                        <p className="text-sm text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        📊
                      </div>
                      <div>
                        <p className="font-medium">Data Analysis Report</p>
                        <p className="text-sm text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="outline">Processing</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        ✨
                      </div>
                      <div>
                        <p className="font-medium">Content Generation</p>
                        <p className="text-sm text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}