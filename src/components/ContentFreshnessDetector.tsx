"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  RefreshCw,
  FileText,
  BarChart3,
  Loader2,
  Zap,
  Eye,
  Target
} from "lucide-react";

interface FreshnessIndicator {
  id: string;
  type: 'date' | 'statistics' | 'references' | 'technology' | 'trends';
  name: string;
  status: 'fresh' | 'stale' | 'outdated';
  confidence: number;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

interface ContentFreshness {
  id: string;
  title: string;
  url: string;
  overallScore: number;
  lastUpdated: string;
  indicators: FreshnessIndicator[];
  recommendations: string[];
  estimatedRefreshTime: string;
}

export default function ContentFreshnessDetector() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [freshnessResults, setFreshnessResults] = useState<ContentFreshness | null>(null);

  // Mock content items
  const contentItems = [
    {
      id: "1",
      title: "Voice Search Optimization Guide 2024",
      url: "/blog/voice-search-optimization",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2", 
      title: "AI Content Creation Best Practices",
      url: "/blog/ai-content-creation",
      lastUpdated: "2024-02-20"
    },
    {
      id: "3",
      title: "Local SEO Strategies for Small Businesses",
      url: "/blog/local-seo-strategies",
      lastUpdated: "2023-11-10"
    }
  ];

  // Mock freshness analysis results
  const mockFreshnessResults: ContentFreshness = {
    id: "1",
    title: "Voice Search Optimization Guide 2024",
    url: "/blog/voice-search-optimization",
    overallScore: 78,
    lastUpdated: "2024-01-15",
    estimatedRefreshTime: "3-4 hours",
    indicators: [
      {
        id: "1",
        type: "date",
        name: "Publication Date",
        status: "fresh",
        confidence: 95,
        description: "Content was published within the last 6 months",
        recommendation: "Content is relatively recent, but consider quarterly reviews",
        priority: "low"
      },
      {
        id: "2",
        type: "statistics",
        name: "Statistics & Data",
        status: "stale",
        confidence: 88,
        description: "Some statistics are from 2023 and may need updating",
        recommendation: "Update voice search adoption statistics with latest 2024 data",
        priority: "high"
      },
      {
        id: "3",
        type: "references",
        name: "External References",
        status: "fresh",
        confidence: 92,
        description: "Most references are current and relevant",
        recommendation: "Add 1-2 recent case studies from 2024",
        priority: "medium"
      },
      {
        id: "4",
        type: "technology",
        name: "Technology References",
        status: "stale",
        confidence: 85,
        description: "Some AI assistant technologies mentioned have been updated",
        recommendation: "Update sections on latest AI assistant capabilities",
        priority: "high"
      },
      {
        id: "5",
        type: "trends",
        name: "Industry Trends",
        status: "stale",
        confidence: 78,
        description: "Missing some emerging trends in voice search",
        recommendation: "Add section on multilingual voice search trends",
        priority: "medium"
      }
    ],
    recommendations: [
      "Update voice search statistics with Q1 2024 data",
      "Add recent case studies from enterprise implementations",
      "Include new AI assistant features and capabilities",
      "Add section on voice search for e-commerce",
      "Update examples with latest voice search queries"
    ]
  };

  const handleAnalyzeFreshness = async () => {
    if (!selectedContent) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setFreshnessResults(mockFreshnessResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'text-green-600';
      case 'stale': return 'text-yellow-600';
      case 'outdated': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'stale': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'outdated': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'statistics': return <BarChart3 className="w-4 h-4" />;
      case 'references': return <FileText className="w-4 h-4" />;
      case 'technology': return <Zap className="w-4 h-4" />;
      case 'trends': return <TrendingUp className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Content Freshness Detector</h3>
          <p className="text-muted-foreground">
            AI-powered analysis to identify outdated content and refresh opportunities
          </p>
        </div>
      </div>

      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Analyze Content Freshness
          </CardTitle>
          <CardDescription>
            Select content to analyze for freshness indicators and update recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <select 
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Select content to analyze...</option>
                {contentItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              onClick={handleAnalyzeFreshness}
              disabled={!selectedContent || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Analyze Freshness
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {freshnessResults && (
        <>
          {/* Overall Freshness Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Overall Freshness Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{freshnessResults.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(freshnessResults.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{freshnessResults.overallScore}%</div>
                  <div className="text-sm text-muted-foreground">Freshness Score</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Content Freshness</span>
                  <span className="text-sm font-medium">{freshnessResults.overallScore}%</span>
                </div>
                <Progress value={freshnessResults.overallScore} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Needs Refresh</span>
                  <span>Fresh</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{freshnessResults.indicators.filter(i => i.status === 'fresh').length}</div>
                  <div className="text-sm text-muted-foreground">Fresh Indicators</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">{freshnessResults.indicators.filter(i => i.status === 'stale').length}</div>
                  <div className="text-sm text-muted-foreground">Needs Attention</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Freshness Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Freshness Indicators
              </CardTitle>
              <CardDescription>
                Detailed analysis of content freshness across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {freshnessResults.indicators.map((indicator) => (
                  <Card key={indicator.id} className={`border-l-4 ${
                    indicator.status === 'fresh' ? 'border-l-green-500' : 
                    indicator.status === 'stale' ? 'border-l-yellow-500' : 'border-l-red-500'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(indicator.type)}
                          <div>
                            <h4 className="font-semibold">{indicator.name}</h4>
                            <p className="text-sm text-muted-foreground">{indicator.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(indicator.status)}
                          <Badge variant="outline" className={getStatusColor(indicator.status)}>
                            {indicator.status}
                          </Badge>
                          <Badge variant={getPriorityColor(indicator.priority)}>
                            {indicator.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm">
                          <span className="font-medium">Confidence:</span> {indicator.confidence}%
                        </div>
                        <Progress value={indicator.confidence} className="w-32 h-2" />
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Recommendation:</strong> {indicator.recommendation}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Refresh Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-600" />
                Refresh Recommendations
              </CardTitle>
              <CardDescription>
                Prioritized actions to improve content freshness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Estimated Refresh Time</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on the analysis, refreshing this content will take approximately:
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{freshnessResults.estimatedRefreshTime}</div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Recommended Actions:</h4>
                  {freshnessResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1">{recommendation}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <Button className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Refresh Process
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}