"use client";

import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropZone } from "@/components/DropZone";
import { Paywall } from "@/components/Paywall";
import { EncryptedVault } from "@/components/EncryptedVault";
import { AITaggingModule } from "@/components/AITaggingModule";
import { PremiumBadge, PremiumButton, PremiumFeature } from "@/components/PremiumBadge";
import { AIEnhancedPhotoManager } from "@/components/AIEnhancedPhotoManager";
import { MultiModelAIAnalyzer } from "@/components/MultiModelAIAnalyzer";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { OnDeviceAnalyzer } from "@/components/OnDeviceAnalyzer";
import { PINPad } from "@/components/PINPad";
import { scanMultiplePhotos } from "@/lib/scan-photos";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { registerServiceWorker, useKeyboardShortcut } from "@/lib/cache";
import { useKeyboardShortcut as useNavShortcut } from "@/lib/keyboard-navigation";
import { useTheme, HighContrastToggle } from "@/components/theme-provider";
import { offlineStorage, useOfflineStorage } from "@/lib/offline-storage";
import { 
  Shield, 
  Settings, 
  Image as ImageIcon, 
  Wifi,
  WifiOff,
  Crown,
  Vault,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  Cpu,
  Network,
  Zap,
  BarChart3,
  Lock,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Users,
  Star,
  Award,
  Diamond,
  Rocket,
  ShieldCheck,
  Fingerprint,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Globe,
  Heart,
  ThumbsUp,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoItem {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: Date;
  fileSize: number;
  file?: File;
  confidence?: number;
  categories?: string[];
  aiAnalysis?: any;
  aiDescription?: string;
  privacyConcerns?: string[];
  privacySuggestions?: string[];
  lastAnalyzed?: Date;
}

interface UsageStats {
  storageUsed: number;
  storageLimit: number;
  photosScanned: number;
  scanLimit: number;
  aiTagsGenerated: number;
  aiTagLimit: number;
  vaultAccess: boolean;
  advancedEditing: boolean;
}

export default function Home() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningPhoto, setCurrentScanningPhoto] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showPINPad, setShowPINPad] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");
  const [isEnhancedUI, setIsEnhancedUI] = useState(true);
  
  const { toast } = useToast();
  const { isPremium, hasActiveTrial, trialDaysRemaining, subscribe, startFreeTrial, usage } = useSecureSubscription();
  const { isOnline: offlineStatus } = useOfflineStorage();
  const { isHighContrast, toggleHighContrast } = useTheme();

  // Enhanced analytics data
  const analyticsData = useMemo(() => {
    const totalPhotos = photos.length;
    const safePhotos = photos.filter(p => p.status === "safe").length;
    const flaggedPhotos = photos.filter(p => p.status === "flagged").length;
    const scannedPhotos = photos.filter(p => p.scanDate).length;
    const pendingPhotos = photos.filter(p => p.status === "pending").length;
    
    return {
      totalPhotos,
      safePhotos,
      flaggedPhotos,
      scannedPhotos,
      pendingPhotos,
      safetyRate: totalPhotos > 0 ? (safePhotos / totalPhotos) * 100 : 0,
      scanCompletion: totalPhotos > 0 ? (scannedPhotos / totalPhotos) * 100 : 0,
      avgConfidence: photos.filter(p => p.confidence).reduce((sum, p) => sum + (p.confidence || 0), 0) / photos.filter(p => p.confidence).length || 0
    };
  }, [photos]);

  // Premium features showcase
  const premiumFeatures = useMemo(() => [
    {
      icon: <Diamond className="w-6 h-6" />,
      title: "Unlimited Storage",
      description: "From 500MB to 1TB encrypted cloud storage",
      gradient: "gradient-premium"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Organization",
      description: "Smart tagging and facial recognition",
      gradient: "gradient-primary"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Military Security",
      description: "AES-256 encryption and biometric protection",
      gradient: "gradient-safety"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for mobile and desktop performance",
      gradient: "gradient-accent"
    }
  ], []);

  const startScanning = useCallback(async () => {
    const pendingPhotos = photos.filter(p => p.status === "pending" && p.file);
    if (pendingPhotos.length === 0) {
      toast({
        title: "No Photos to Scan",
        description: "All photos have been scanned or are being processed",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setCurrentScanningPhoto("");

    try {
      setPhotos(prev => 
        prev.map(photo => 
          photo.status === "pending" 
            ? { ...photo, status: "scanning" as const }
            : photo
        )
      );

      const files = pendingPhotos.map(p => p.file!);
      const results = await scanMultiplePhotos(
        pendingPhotos, 
        files, 
        (progress, currentPhoto) => {
          setScanProgress(progress);
          setCurrentScanningPhoto(currentPhoto);
        }
      );

      setPhotos(prev => 
        prev.map(photo => {
          const result = results.find(r => r.photoId === photo.id);
          if (!result) return photo;

          return {
            ...photo,
            status: result.isNsfw ? "flagged" : "safe",
            scanDate: new Date(),
            confidence: result.confidence,
            categories: result.categories,
          };
        })
      );

      const flaggedCount = results.filter(r => r.isNsfw).length;
      const safeCount = results.filter(r => !r.isNsfw).length;

      toast({
        title: "Scanning Complete",
        description: `Analyzed ${results.length} photos: ${safeCount} safe, ${flaggedCount} flagged`,
      });

    } catch (error) {
      console.error("Scanning error:", error);
      toast({
        title: "Scanning Failed",
        description: error instanceof Error ? error.message : "An error occurred during scanning",
        variant: "destructive",
      });

      setPhotos(prev => 
        prev.map(photo => 
          photo.status === "scanning" 
            ? { ...photo, status: "pending" as const }
            : photo
        )
      );
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setCurrentScanningPhoto("");
    }
  }, [photos, toast]);

  useEffect(() => {
    registerServiceWorker();
    
    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced keyboard shortcuts
  useNavShortcut({
    key: 's',
    ctrl: true,
    preventDefault: true,
    action: () => {
      if (!isScanning && photos.filter(p => p.status === "pending").length > 0) {
        startScanning();
      }
    }
  }, [isScanning, photos, startScanning]);

  useNavShortcut({
    key: 'u',
    ctrl: true,
    preventDefault: true,
    action: () => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }, []);

  useNavShortcut({
    key: 'v',
    ctrl: true,
    preventDefault: true,
    action: () => {
      setShowVault(true);
    }
  }, []);

  useNavShortcut({
    key: 'p',
    ctrl: true,
    preventDefault: true,
    action: () => {
      setShowPINPad(true);
    }
  }, []);

  useNavShortcut({
    key: 'Escape',
    preventDefault: true,
    action: () => {
      if (showPaywall) setShowPaywall(false);
      if (showVault) setShowVault(false);
      if (showPINPad) setShowPINPad(false);
    }
  }, [showPaywall, showVault, showPINPad]);

  const handleSubscribe = async (plan: "monthly" | "annual" | "lifetime") => {
    try {
      await subscribe(plan);
      toast({
        title: "Welcome to Premium!",
        description: "You now have access to all premium features.",
      });
      setShowPaywall(false);
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Unable to complete subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartTrial = async () => {
    try {
      await startFreeTrial();
      toast({
        title: "Trial Started!",
        description: "Enjoy 30 days of premium features for free.",
      });
      setShowPaywall(false);
    } catch (error) {
      toast({
        title: "Trial Activation Failed",
        description: "Unable to start trial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePINSuccess = () => {
    setShowPINPad(false);
    toast({
      title: "PIN Verified",
      description: "Access granted to premium features.",
    });
  };

  const handleFilesAdded = useCallback((files: File[]) => {
    const newPhotos: PhotoItem[] = files.map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      status: "pending",
      fileSize: file.size,
      file: file,
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    toast({
      title: "Photos Added",
      description: `${files.length} photo${files.length > 1 ? 's' : ''} uploaded successfully`,
    });
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap min-w-0 flex-1">
              <div className="relative">
                <Shield className="w-7 h-7 text-primary animate-pulse-slow" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gradient truncate">Private Photo Guardian</h1>
                <p className="text-xs text-muted-foreground truncate">AI-Powered Security & Organization</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isPremium && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white">PRO</span>
                  </div>
                )}
                {hasActiveTrial && (
                  <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs px-2 py-1">
                    {trialDaysRemaining}d trial
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <HighContrastToggle className="p-2 h-auto w-auto text-muted-foreground hover:text-foreground transition-colors" />
              <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg">
                {isOnline ? (
                  <><Wifi className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">Online</span></>
                ) : (
                  <><WifiOff className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500">Offline</span></>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowVault(true)}
                className="p-2 h-auto w-auto"
                aria-label="Open vault"
              >
                <Vault className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-auto w-auto" aria-label="Settings">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Hero Section */}
        <Card className="premium-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upload Section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gradient">Upload & Secure</h2>
                    <p className="text-sm text-muted-foreground">Advanced AI-powered photo analysis</p>
                  </div>
                </div>
                
                <DropZone onFilesAdded={handleFilesAdded} />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={startScanning}
                    disabled={isScanning || photos.filter(p => p.status === "pending").length === 0}
                    className="premium-button flex-1"
                  >
                    {isScanning ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</>
                    ) : (
                      <><Shield className="w-4 h-4 mr-2" />Start Scanning</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowVault(true)}
                    className="flex-1"
                  >
                    <Vault className="w-4 h-4 mr-2" />
                    Secure Vault
                  </Button>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{analyticsData.totalPhotos}</div>
                    <div className="text-xs text-muted-foreground">Total Photos</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{analyticsData.safePhotos}</div>
                    <div className="text-xs text-muted-foreground">Safe</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">{analyticsData.flaggedPhotos}</div>
                    <div className="text-xs text-muted-foreground">Flagged</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(analyticsData.safetyRate)}%</div>
                    <div className="text-xs text-muted-foreground">Safety Rate</div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span>{formatFileSize(usage.storageUsed)} / {formatFileSize(usage.storageLimit)}</span>
                  </div>
                  <Progress value={getUsagePercentage(usage.storageUsed, usage.storageLimit)} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Scans</span>
                    <span>{usage.photosScanned} / {usage.scanLimit}</span>
                  </div>
                  <Progress value={getUsagePercentage(usage.photosScanned, usage.scanLimit)} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Scanning Progress */}
        {isScanning && (
          <Card className="premium-card border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600 animate-pulse" />
                    AI Scanning in Progress
                  </h3>
                  <span className="text-sm font-medium text-blue-600">{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} className="h-3" />
                {currentScanningPhoto && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Currently analyzing: <span className="font-medium truncate">{currentScanningPhoto}</span>
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-blue-100/50 rounded">
                    <Brain className="w-3 h-3 text-blue-600" />
                    <span>AI Content Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-100/50 rounded">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span>Privacy Detection</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-100/50 rounded">
                    <Zap className="w-3 h-3 text-blue-600" />
                    <span>Real-time Processing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 gap-2 p-1 bg-muted/50 rounded-xl h-auto">
            <TabsTrigger value="gallery" className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
              <Brain className="w-5 h-5" />
              <span className="text-xs font-medium">AI Org</span>
            </TabsTrigger>
            <TabsTrigger value="ondevice" className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
              <Cpu className="w-5 h-5" />
              <span className="text-xs font-medium">On-Device</span>
            </TabsTrigger>
            <TabsTrigger value="multimodel" className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
              <Network className="w-5 h-5" />
              <span className="text-xs font-medium">Multi-Model</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
              <Crown className="w-5 h-5" />
              <span className="text-xs font-medium">Premium</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
              <Shield className="w-5 h-5" />
              <span className="text-xs font-medium">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            <Suspense fallback={<div className="text-center py-8">Loading gallery...</div>}>
              <AIEnhancedPhotoManager
                photos={photos}
                onPhotosUpdate={setPhotos}
                isPremium={isPremium}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gradient mb-2">AI Organization</h2>
                <p className="text-muted-foreground">Smart tagging and intelligent photo organization</p>
              </div>
              <AITaggingModule
                photos={photos.map(p => ({
                  ...p,
                  tags: p.categories?.map(cat => ({
                    id: `tag-${cat}`,
                    name: cat,
                    type: "custom" as const,
                    confidence: 0.8,
                    color: "bg-purple-500/20 text-purple-400 border-purple-500/50"
                  })) || []
                }))}
                onTagsUpdate={(photoId, tags) => {
                  setPhotos(prev => prev.map(p => 
                    p.id === photoId 
                      ? { ...p, categories: tags.map(t => t.name) }
                      : p
                  ));
                }}
                isPremium={isPremium}
              />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="ondevice" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gradient mb-2">On-Device AI</h2>
              <p className="text-muted-foreground">Private analysis with GLM 4.5 - no server required</p>
            </div>
            <OnDeviceAnalyzer 
              onAnalysisComplete={(result, confidence) => {
                toast({
                  title: "Analysis Complete",
                  description: `On-device analysis completed with ${(confidence * 100).toFixed(1)}% confidence`,
                });
              }}
            />
          </TabsContent>

          <TabsContent value="multimodel" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gradient mb-2">Multi-Model AI</h2>
              <p className="text-muted-foreground">Advanced analysis with GLM-4.5V, AIR, and ensemble capabilities</p>
            </div>
            
            {photos.length > 0 ? (
              <div className="space-y-6">
                {photos.map((photo) => (
                  photo.file && (
                    <MultiModelAIAnalyzer
                      key={photo.id}
                      photoId={photo.id}
                      file={photo.file}
                      onAnalysisComplete={(result) => {
                        console.log('Multi-model analysis complete:', result);
                        toast({
                          title: "Multi-Model Analysis Complete",
                          description: "Advanced AI analysis with multiple models finished successfully",
                        });
                      }}
                    />
                  )
                ))}
              </div>
            ) : (
              <Card className="premium-card">
                <CardContent className="p-12 text-center">
                  <Network className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Photos for Analysis</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload photos to enable multi-model AI analysis
                  </p>
                  <Button onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }} className="premium-button">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <Card className="premium-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-500/10 to-transparent"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 gradient-premium rounded-2xl flex items-center justify-center shadow-premium">
                    <Crown className="w-12 h-12 text-white animate-float" />
                  </div>
                  
                  <h2 className="text-4xl font-bold text-gradient-premium mb-2">Premium Experience</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Unlock infinite space, intelligent control, and unbreakable security
                  </p>

                  {isPremium ? (
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">
                          Premium Active - Enjoy All Features
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {premiumFeatures.map((feature, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                            <div className={`w-10 h-10 rounded-lg ${feature.gradient} flex items-center justify-center mb-3`}>
                              {feature.icon}
                            </div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {hasActiveTrial ? (
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                          <Clock className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">
                            {trialDaysRemaining} days left in trial
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-full">
                          <Sparkles className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold">
                            30-day free trial available
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {premiumFeatures.map((feature, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg border hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-lg ${feature.gradient} flex items-center justify-center mb-3`}>
                              {feature.icon}
                            </div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => setShowPINPad(true)}
                          className="premium-button text-lg px-8 py-3"
                        >
                          {hasActiveTrial ? "Upgrade Now" : "Start Free Trial"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowVault(true)}
                          className="text-lg px-8 py-3"
                        >
                          <Vault className="w-4 h-4 mr-2" />
                          Try Secure Vault
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Enhanced Modals */}
      <Paywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={handleSubscribe}
        hasFreeTrial={!hasActiveTrial}
      />

      <EncryptedVault
        isOpen={showVault}
        onClose={() => setShowVault(false)}
        isPremium={isPremium}
      />

      <PINPad
        isOpen={showPINPad}
        onClose={() => setShowPINPad(false)}
        onSuccess={handlePINSuccess}
        title="Premium Access"
        description="Enter your 4-digit PIN to access premium features"
      />
    </div>
  );
}