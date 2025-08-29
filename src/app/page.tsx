"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to dashboard or main app interface
    router.push("/dashboard");
  };

  const handleLearnMore = () => {
    // Navigate to features page or scroll to features section
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartTrial = () => {
    // Navigate to signup/trial page
    router.push("/signup");
  };

  const handleScheduleDemo = () => {
    // Navigate to demo scheduling page
    router.push("/demo");
  };

  const handleFeatureClick = (feature: string) => {
    // Navigate to specific feature page
    router.push(`/features/${feature.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                🚀 Next Generation AI Platform
              </Badge>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">OptiMind</span>
                <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Ecosystem
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
                Revolutionize how businesses and individuals interact with advanced AI technologies through intelligent automation, analytics, and decision-making.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Core Capabilities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI features designed to transform your business operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card 
            className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleFeatureClick("Intelligent Automation")}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                🧠
              </div>
              <CardTitle>Intelligent Automation</CardTitle>
              <CardDescription>
                Automate complex business processes with AI-driven workflows and smart decision-making
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleFeatureClick("Advanced Analytics")}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                📊
              </div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Real-time data processing, predictive analytics, and comprehensive business intelligence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleFeatureClick("AI Assistant")}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                🤖
              </div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Natural language processing, computer vision, and speech recognition capabilities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Built with Modern Technology</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge frameworks and tools for optimal performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-2xl">⚡</div>
              <h3 className="font-semibold">Next.js 15</h3>
              <p className="text-sm text-muted-foreground">React Framework</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">📘</div>
              <h3 className="font-semibold">TypeScript</h3>
              <p className="text-sm text-muted-foreground">Type Safety</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🎨</div>
              <h3 className="font-semibold">Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground">Styling</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🧩</div>
              <h3 className="font-semibold">shadcn/ui</h3>
              <p className="text-sm text-muted-foreground">Components</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Quick Access</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our AI-powered tools and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/chat">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  💬
                </div>
                <CardTitle className="text-lg">AI Chat</CardTitle>
                <CardDescription>
                  Chat with our advanced AI assistant
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/analyze">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  🔍
                </div>
                <CardTitle className="text-lg">Data Analysis</CardTitle>
                <CardDescription>
                  Analyze data with AI-powered insights
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/generate">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  ✨
                </div>
                <CardTitle className="text-lg">Content Generator</CardTitle>
                <CardDescription>
                  Create content with AI assistance
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  🔎
                </div>
                <CardTitle className="text-lg">Smart Search</CardTitle>
                <CardDescription>
                  Intelligent search with AI understanding
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the future of AI-powered business operations with OptiMind AI Ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={handleScheduleDemo}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}