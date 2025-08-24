"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Target, 
  TrendingUp, 
  BarChart3, 
  FileText,
  Eye,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Award,
  Clock,
  Loader2,
  Globe,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Star
} from "lucide-react";

interface CompetitorContent {
  id: string;
  url: string;
  title: string;
  domain: string;
  wordCount: number;
  publishedDate: string;
  lastUpdated: string;
  contentScore: number;
  seoScore: number;
  readabilityScore: number;
  engagementScore: number;
  ranking: number;
  backlinks: number;
  socialShares: number;
}

interface ContentGap {
  id: string;
  type: 'missing_topic' | 'outdated_info' | 'poor_coverage' | 'missing_format' | 'weak_examples';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedImpact: number;
  competitorCoverage: string[];
}

interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ContentStrategy {
  targetKeywords: string[];
  contentAngles: string[];
  formatRecommendations: string[];
  timeline: string;
  resources: string[];
}

export default function CompetitorContentAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [analysisResults, setAnalysisResults] = useState<{
    content: CompetitorContent;
    gaps: ContentGap[];
    swot: SWOTAnalysis;
    strategy: ContentStrategy;
  } | null>(null);

  // Mock competitor analysis data
  const mockCompetitorContent: CompetitorContent = {
    id: "1",
    url: "https://competitor.com/voice-search-guide",
    title: "Complete Voice Search Optimization Guide 2024",
    domain: "competitor.com",
    wordCount: 3200,
    publishedDate: "2024-01-10",
    lastUpdated: "2024-02-15",
    contentScore: 88,
    seoScore: 92,
    readabilityScore: 85,
    engagementScore: 78,
    ranking: 1,
    backlinks: 145,
    socialShares: 892
  };

  const mockContentGaps: ContentGap[] = [
    {
      id: "1",
      type: "missing_topic",
      title: "Multilingual Voice Search",
      description: "No coverage of voice search optimization for multiple languages",
      priority: "high",
      difficulty: "medium",
      estimatedImpact: 85,
      competitorCoverage: ["Basic mention only", "No examples"]
    },
    {
      id: "2",
      type: "outdated_info",
      title: "AI Assistant Updates",
      description: "Missing latest AI assistant capabilities and features",
      priority: "high",
      difficulty: "easy",
      estimatedImpact: 75,
      competitorCoverage: ["Outdated examples", "Missing new features"]
    },
    {
      id: "3",
      type: "missing_format",
      title: "Video Content",
      description: "No video tutorials or demonstrations",
      priority: "medium",
      difficulty: "hard",
      estimatedImpact: 90,
      competitorCoverage: ["Text only", "No multimedia"]
    },
    {
      id: "4",
      type: "weak_examples",
      title: "Case Studies",
      description: "Limited real-world implementation examples",
      priority: "medium",
      difficulty: "medium",
      estimatedImpact: 70,
      competitorCoverage: ["Generic examples", "No specific cases"]
    }
  ];

  const mockSWOT: SWOTAnalysis = {
    strengths: [
      "Comprehensive coverage of voice search basics",
      "Well-structured content with clear headings",
      "Strong SEO optimization with proper keywords",
      "Recent content updates",
      "Good internal linking structure"
    ],
    weaknesses: [
      "Lacks multimedia content (videos, infographics)",
      "Limited real-world case studies",
      "No coverage of multilingual voice search",
      "Outdated AI assistant examples",
      "Poor mobile optimization"
    ],
    opportunities: [
      "Add video tutorials and demonstrations",
      "Include expert interviews and quotes",
      "Create interactive tools and calculators",
      "Expand to cover voice commerce",
      "Add local business voice search strategies"
    ],
    threats: [
      "Google's algorithm changes affecting voice search",
      "New competitors entering the space",
      "Rapidly evolving AI assistant technology",
      "Increasing competition for voice search keywords",
      "User behavior shifts in search patterns"
    ]
  };

  const mockStrategy: ContentStrategy = {
    targetKeywords: [
      "voice search optimization 2024",
      "AI assistant SEO",
      "multilingual voice search",
      "voice commerce optimization",
      "local business voice search"
    ],
    contentAngles: [
      "Enterprise voice search implementation",
      "Voice search for e-commerce",
      "Multilingual voice optimization",
      "AI assistant compatibility",
      "Voice search analytics and tracking"
    ],
    formatRecommendations: [
      "Create comprehensive guide with video tutorials",
      "Add interactive voice search simulator",
      "Include downloadable checklist and templates",
      "Develop case study series",
      "Create expert interview series"
    ],
    timeline: "8-12 weeks",
    resources: [
      "Content writer with SEO expertise",
      "Video production team",
      "Voice search experts for interviews",
      "UX/UI designer for interactive tools",
      "Developer for technical implementation"
    ]
  };

  const handleAnalyzeCompetitor = async () => {
    if (!competitorUrl) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults({
        content: mockCompetitorContent,
        gaps: mockContentGaps,
        swot: mockSWOT,
        strategy: mockStrategy
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getGapTypeIcon = (type: string) => {
    switch (type) {
      case 'missing_topic': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'outdated_info': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'poor_coverage': return <ThumbsDown className="w-4 h-4 text-orange-500" />;
      case 'missing_format': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'weak_examples': return <Lightbulb className="w-4 h-4 text-purple-500" />;
      default: return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Competitor Content Analysis</h3>
          <p className="text-muted-foreground">
            Analyze competitor content strategies and identify opportunities to outperform them
          </p>
        </div>
      </div>

      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Analyze Competitor Content
          </CardTitle>
          <CardDescription>
            Enter a competitor URL to analyze their content strategy and identify gaps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter competitor URL..."
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAnalyzeCompetitor}
              disabled={!competitorUrl || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Competitor
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Competitor Content Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Content Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{analysisResults.content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {analysisResults.content.domain}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Rank #{analysisResults.content.ranking}
                      </span>
                      <span>{analysisResults.content.wordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{analysisResults.content.contentScore}%</div>
                    <div className="text-sm text-muted-foreground">Content Score</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{analysisResults.content.seoScore}%</div>
                    <div className="text-sm text-muted-foreground">SEO Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{analysisResults.content.readabilityScore}%</div>
                    <div className="text-sm text-muted-foreground">Readability</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{analysisResults.content.engagementScore}%</div>
                    <div className="text-sm text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{analysisResults.content.backlinks}</div>
                    <div className="text-sm text-muted-foreground">Backlinks</div>
                  </div>
                </div>

                {/* Content Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Content Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Word Count</span>
                        <span className="text-sm font-medium">{analysisResults.content.wordCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Social Shares</span>
                        <span className="text-sm font-medium">{analysisResults.content.socialShares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Backlinks</span>
                        <span className="text-sm font-medium">{analysisResults.content.backlinks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Search Ranking</span>
                        <span className="text-sm font-medium">#{analysisResults.content.ranking}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Publication Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Published</span>
                        <span className="text-sm font-medium">{new Date(analysisResults.content.publishedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Updated</span>
                        <span className="text-sm font-medium">{new Date(analysisResults.content.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Content Age</span>
                        <span className="text-sm font-medium">
                          {Math.floor((Date.now() - new Date(analysisResults.content.publishedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Content Gap Analysis
                </CardTitle>
                <CardDescription>
                  Identify opportunities where you can outperform competitor content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.gaps.map((gap) => (
                    <Card key={gap.id} className="border-l-4 border-l-red-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getGapTypeIcon(gap.type)}
                            <div>
                              <h4 className="font-semibold">{gap.title}</h4>
                              <p className="text-sm text-muted-foreground">{gap.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(gap.priority)}>
                              {gap.priority}
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(gap.difficulty)}>
                              {gap.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm">
                            <span className="font-medium">Estimated Impact:</span> {gap.estimatedImpact}%
                          </div>
                          <Progress value={gap.estimatedImpact} className="w-32 h-2" />
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-red-600">Competitor Coverage:</h5>
                          <div className="flex flex-wrap gap-2">
                            {gap.competitorCoverage.map((coverage, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {coverage}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swot" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <ThumbsUp className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.swot.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <ThumbsDown className="w-5 h-5" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.swot.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Lightbulb className="w-5 h-5" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.swot.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.swot.threats.map((threat, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Recommended Strategy
                </CardTitle>
                <CardDescription>
                  Data-driven strategy to outperform competitor content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Target Keywords</h4>
                    <div className="space-y-2">
                      {analysisResults.strategy.targetKeywords.map((keyword, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Content Angles</h4>
                    <div className="space-y-2">
                      {analysisResults.strategy.contentAngles.map((angle, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Lightbulb className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{angle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Format Recommendations</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {analysisResults.strategy.formatRecommendations.map((format, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">{format}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Timeline</h4>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{analysisResults.strategy.timeline}</div>
                      <div className="text-sm text-muted-foreground">Estimated completion time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Required Resources</h4>
                    <div className="space-y-2">
                      {analysisResults.strategy.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button className="flex-1">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Implement Strategy
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Export Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}