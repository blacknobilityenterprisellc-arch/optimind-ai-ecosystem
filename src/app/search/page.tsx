"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  relevance: number
  url: string
  snippet: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    
    // Simulate AI-powered search
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Understanding AI Implementation in Business",
          description: "Comprehensive guide to implementing artificial intelligence solutions in modern business environments",
          category: "Article",
          relevance: 0.95,
          url: "/articles/ai-implementation",
          snippet: "Artificial Intelligence has become a cornerstone of modern business strategy, offering unprecedented opportunities for automation, insight generation, and competitive advantage..."
        },
        {
          id: "2", 
          title: "AI-Powered Data Analytics Tools",
          description: "Explore the latest tools and technologies for AI-driven data analysis and business intelligence",
          category: "Tools",
          relevance: 0.88,
          url: "/tools/ai-analytics",
          snippet: "Modern data analytics platforms leverage machine learning algorithms to provide deeper insights, predictive capabilities, and automated reporting features..."
        },
        {
          id: "3",
          title: "Machine Learning Best Practices",
          description: "Essential best practices for developing and deploying machine learning models in production",
          category: "Documentation",
          relevance: 0.82,
          url: "/docs/ml-best-practices",
          snippet: "Successful machine learning implementation requires careful consideration of data quality, model selection, validation strategies, and ongoing monitoring..."
        },
        {
          id: "4",
          title: "Natural Language Processing Applications",
          description: "Real-world applications of NLP in customer service, content analysis, and business intelligence",
          category: "Case Study",
          relevance: 0.79,
          url: "/case-studies/nlp-applications",
          snippet: "Natural Language Processing technologies are transforming how businesses interact with customers, analyze feedback, and extract insights from unstructured text data..."
        },
        {
          id: "5",
          title: "AI Ethics and Governance Framework",
          description: "Establishing ethical guidelines and governance structures for responsible AI deployment",
          category: "Framework",
          relevance: 0.75,
          url: "/frameworks/ai-ethics",
          snippet: "As AI systems become more prevalent in business operations, establishing robust ethical frameworks and governance structures is essential for responsible implementation..."
        }
      ]
      
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
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
                🔎
              </div>
              <div>
                <h1 className="text-2xl font-bold">Smart Search</h1>
                <p className="text-sm text-muted-foreground">AI-powered intelligent search</p>
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
        {/* Search Interface */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Intelligent Search</CardTitle>
              <CardDescription className="text-lg">
                Our AI understands context, intent, and meaning to deliver the most relevant results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What would you like to search for? Try questions, phrases, or concepts..."
                    className="text-lg py-3 px-4 pr-12"
                    disabled={isSearching}
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="absolute right-1 top-1 h-10 px-4"
                    disabled={isSearching || !query.trim()}
                  >
                    Search
                  </Button>
                </div>
                
                {/* Search Suggestions */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Popular searches:</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery("AI implementation strategies")}
                  >
                    AI implementation strategies
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery("data analytics best practices")}
                  >
                    data analytics best practices
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery("machine learning models")}
                  >
                    machine learning models
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} results for "{query}"
              </p>
            </div>
            
            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {result.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{result.description}</p>
                        <p className="text-sm text-muted-foreground mb-3">{result.snippet}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Relevance: {Math.round(result.relevance * 100)}%
                          </span>
                          <Button variant="outline" size="sm">View Result</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchResults.length && !isSearching && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  🔎
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Search Ready</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Enter your search query above to get AI-powered results that understand context, intent, and meaning.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Understands natural language queries</p>
                  <p>✓ Provides contextually relevant results</p>
                  <p>✓ Ranks results by relevance and quality</p>
                  <p>✓ Supports complex questions and concepts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search in Progress */}
        {isSearching && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Searching with AI intelligence...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Analyzing context and finding the most relevant results
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}