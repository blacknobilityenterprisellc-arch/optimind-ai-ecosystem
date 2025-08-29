"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function AnalyzePage() {
  const [inputData, setInputData] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!inputData.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        summary: "Based on the provided data, I can identify several key patterns and insights that can help inform your decision-making process.",
        insights: [
          {
            category: "Trend Analysis",
            finding: "Positive growth trajectory detected with 23% increase in key metrics",
            confidence: 0.89
          },
          {
            category: "Risk Assessment", 
            finding: "Moderate risk factors identified in operational efficiency",
            confidence: 0.76
          },
          {
            category: "Opportunity",
            finding: "Market expansion opportunities identified in emerging sectors",
            confidence: 0.92
          }
        ],
        recommendations: [
          "Focus on scaling successful initiatives to maintain growth momentum",
          "Address operational inefficiencies to reduce risk exposure",
          "Explore strategic partnerships for market expansion"
        ],
        metrics: {
          dataPoints: 1247,
          confidence: 0.86,
          processingTime: "2.3s"
        }
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                🔍
              </div>
              <div>
                <h1 className="text-2xl font-bold">Data Analysis</h1>
                <p className="text-sm text-muted-foreground">AI-powered insights and recommendations</p>
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
                <CardTitle>Input Data</CardTitle>
                <CardDescription>
                  Enter your data for AI analysis. This can be text, numbers, or any information you want insights on.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Paste your data here... This can be sales figures, customer feedback, market research, or any business data you want analyzed."
                  rows={8}
                />
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full" 
                  disabled={isAnalyzing || !inputData.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Data"}
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
                  onClick={() => setInputData("Q1 Sales: $125,000, Q2 Sales: $145,000, Q3 Sales: $168,000, Q4 Sales: $192,000. Customer satisfaction: 4.2/5. Market share: 12%.")}
                >
                  📊 Sales Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm"
                  onClick={() => setInputData("Customer feedback: 'Great product but needs better support', 'Love the new features', 'Pricing is too high', 'Excellent user experience', 'Need more integration options'")}
                >
                  💬 Customer Feedback
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm"
                  onClick={() => setInputData("Team productivity: Design team - 85%, Development team - 92%, Marketing team - 78%, Sales team - 88%. Project completion rate: 94%.")}
                >
                  👥 Team Performance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {analysisResult ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{analysisResult.summary}</p>
                  </CardContent>
                </Card>

                {/* Key Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.insights.map((insight: any, index: number) => (
                        <div key={index} className="border-l-4 border-primary/20 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{insight.category}</h4>
                            <Badge variant="outline">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{insight.finding}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-xs">✓</span>
                          </div>
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{analysisResult.metrics.dataPoints}</div>
                        <div className="text-sm text-muted-foreground">Data Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.round(analysisResult.metrics.confidence * 100)}%</div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{analysisResult.metrics.processingTime}</div>
                        <div className="text-sm text-muted-foreground">Processing Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">AI</div>
                        <div className="text-sm text-muted-foreground">Analysis Type</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Export Report</Button>
                      <Button variant="outline" size="sm">Share Insights</Button>
                      <Button variant="outline" size="sm">Schedule Follow-up</Button>
                      <Button variant="outline" size="sm">Analyze More Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    🔍
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Enter your data in the input panel and click "Analyze Data" to get AI-powered insights and recommendations.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ Identify patterns and trends</p>
                    <p>✓ Get actionable recommendations</p>
                    <p>✓ Understand risk factors</p>
                    <p>✓ Discover opportunities</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}