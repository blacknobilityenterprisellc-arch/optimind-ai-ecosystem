"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const contentTypes = [
    { id: "blog-post", name: "Blog Post", icon: "📝" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "social-media", name: "Social Media", icon: "📱" },
    { id: "product-description", name: "Product Description", icon: "🏷️" },
    { id: "ad-copy", name: "Ad Copy", icon: "📢" },
    { id: "report", name: "Report", icon: "📊" }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = {
        "blog-post": `# The Future of AI in Business

Artificial Intelligence is revolutionizing how businesses operate across every industry. From automating routine tasks to providing deep insights that drive strategic decisions, AI has become an indispensable tool for modern organizations.

## Key Benefits

1. **Increased Efficiency**: AI can process and analyze data at speeds impossible for humans, freeing up valuable time for strategic thinking.

2. **Better Decision Making**: With access to comprehensive data analysis, businesses can make more informed decisions with higher confidence levels.

3. **Enhanced Customer Experience**: AI-powered personalization allows businesses to deliver tailored experiences that meet individual customer needs.

## Implementation Strategy

Successful AI implementation requires careful planning and execution. Organizations should start with clear objectives and gradually expand their AI capabilities as they gain experience and confidence.

## Conclusion

The future of business is undoubtedly AI-driven. Organizations that embrace this technology early will have a significant competitive advantage in the years to come.`,
        "email": `Subject: Transform Your Business with AI-Powered Solutions

Dear [Name],

I hope this email finds you well. I'm reaching out to introduce you to how artificial intelligence can revolutionize your business operations.

In today's rapidly evolving business landscape, staying ahead of the curve is more important than ever. Our AI solutions can help you:

• Automate repetitive tasks and increase productivity
• Gain valuable insights from your data
• Enhance customer experience with personalization
• Make better, data-driven decisions

I'd love to schedule a brief 15-minute call to discuss how we can tailor our AI solutions to meet your specific business needs. Are you available sometime next week?

Looking forward to hearing from you.

Best regards,
[Your Name]`,
        "social-media": `🚀 Revolutionize Your Business with AI! 🤖

Did you know that businesses using AI are seeing 40% increases in productivity? 

Our cutting-edge AI solutions help you:
✅ Automate routine tasks
✅ Gain deep insights from your data
✅ Enhance customer experience
✅ Make smarter decisions faster

Don't get left behind in the AI revolution! 

👉 DM us to learn how we can transform your business operations.

#AI #BusinessTransformation #Innovation #TechSolutions`,
        "product-description": `Introducing OptiMind AI - Your Complete Business Intelligence Solution

OptiMind AI is a comprehensive artificial intelligence platform designed to transform how businesses operate. By leveraging advanced machine learning algorithms and intuitive interfaces, OptiMind AI empowers organizations to make data-driven decisions with unprecedented accuracy and speed.

Key Features:
• Real-time data analysis and insights
• Predictive analytics for forecasting
• Automated workflow optimization
• Seamless integration with existing systems
• 24/7 AI-powered customer support

Whether you're a small startup or a large enterprise, OptiMind AI scales to meet your needs and grows with your business. Experience the future of business intelligence today.

Perfect for: Business analysts, data scientists, executives, and operations managers who demand the best in AI-powered business solutions.`,
        "ad-copy": `🎯 Tired of Making Business Decisions in the Dark?

OptiMind AI illuminates your path to success with cutting-edge artificial intelligence that transforms raw data into actionable insights.

✅ Make smarter decisions, faster
✅ Automate what holds you back  
✅ See opportunities others miss
✅ Stay ahead of competitors

Join thousands of businesses already using OptiMind AI to revolutionize their operations.

🚀 Limited Time: Get your first month FREE!

Don't just adapt to the future - lead it.

#OptiMindAI #BusinessIntelligence #AIRevolution`,
        "report": `EXECUTIVE SUMMARY: AI Implementation Analysis

Date: June 17, 2025
Prepared for: Senior Leadership Team

OVERVIEW
This report provides a comprehensive analysis of artificial intelligence implementation opportunities within our organization. The findings indicate significant potential for AI-driven transformation across multiple business units.

KEY FINDINGS
1. Current State: Manual processes dominate daily operations, creating inefficiencies and limiting scalability.

2. Opportunity Assessment: AI automation could reduce operational costs by 35% while improving service quality.

3. Competitive Landscape: 78% of industry leaders have already implemented AI solutions, creating a significant competitive gap.

RECOMMENDATIONS
1. Immediate Actions (0-3 months):
   - Implement AI-powered data analytics
   - Automate customer service responses
   - Deploy predictive maintenance systems

2. Strategic Initiatives (3-12 months):
   - Develop custom AI models for proprietary processes
   - Integrate AI across all business units
   - Establish AI governance framework

3. Long-term Vision (12+ months):
   - Become industry leader in AI innovation
   - Develop AI-powered products and services
   - Create AI-driven business model

CONCLUSION
AI implementation represents a strategic imperative for our organization. The potential benefits far outweigh the implementation costs, and delay will result in competitive disadvantage.

NEXT STEPS
1. Secure executive approval and funding
2. Assemble cross-functional AI implementation team
3. Develop detailed implementation roadmap
4. Begin pilot programs in high-impact areas`
      }

      setGeneratedContent(sampleContent[contentType as keyof typeof sampleContent] || sampleContent["blog-post"])
      setIsGenerating(false)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                ✨
              </div>
              <div>
                <h1 className="text-2xl font-bold">Content Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered content creation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Ready</Badge>
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>Back</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>
                  Choose your content type and provide a prompt for AI generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={contentType === type.id ? "default" : "outline"}
                        className="text-xs h-16 flex flex-col"
                        onClick={() => setContentType(type.id)}
                      >
                        <span className="text-lg mb-1">{type.icon}</span>
                        <span>{type.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate. Be specific about tone, style, and key points..."
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  className="w-full" 
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? "Generating..." : "Generate Content"}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm"
                  onClick={() => setPrompt("Write a blog post about the benefits of AI in business, focusing on productivity and decision-making improvements.")}
                >
                  📝 AI Business Benefits
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm"
                  onClick={() => setPrompt("Create an email to a potential client introducing our AI platform and its key features.")}
                >
                  📧 Sales Introduction
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm"
                  onClick={() => setPrompt("Generate social media content about our new AI product launch, highlighting key features and benefits.")}
                >
                  📱 Product Launch Post
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  AI-generated content based on your specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Generating content...</p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Copy to Clipboard</Button>
                      <Button variant="outline" size="sm">Download</Button>
                      <Button variant="outline" size="sm">Share</Button>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      ✨
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Select a content type, provide a prompt, and click "Generate Content" to create AI-powered content.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ Professional quality content</p>
                      <p>✓ Customizable tone and style</p>
                      <p>✓ Multiple content formats</p>
                      <p>✓ Edit and refine as needed</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}