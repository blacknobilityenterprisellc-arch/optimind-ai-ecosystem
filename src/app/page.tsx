import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
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
              <Button size="lg" className="px-8 py-3 text-lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Core Capabilities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI features designed to transform your business operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
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

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
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

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
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

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the future of AI-powered business operations with OptiMind AI Ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}