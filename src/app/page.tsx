"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropZone } from "@/components/DropZone";
import { Paywall } from "@/components/Paywall";
import { EncryptedVault } from "@/components/EncryptedVault";
import { AITaggingModule } from "@/components/AITaggingModule";
import { PremiumBadge, PremiumButton, PremiumFeature } from "@/components/PremiumBadge";
import { PhotoManager } from "@/components/PhotoManager";
import { AIEnhancedPhotoManager } from "@/components/AIEnhancedPhotoManager";
import { MultiModelAIAnalyzer } from "@/components/MultiModelAIAnalyzer";
import { SecurityDashboard } from "@/components/SecurityDashboard";
// Temporarily disabled due to syntax errors
// import { SecurityDashboard } from "@/components/SecurityDashboard";
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
  Network
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoItem {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: Date;
  fileSize: number;
  file?: File; // Store the actual file for scanning
  confidence?: number;
  categories?: string[];
  aiAnalysis?: any;
  aiDescription?: string;
  privacyConcerns?: string[];
  privacySuggestions?: string[];
  lastAnalyzed?: Date;
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
  
  const { toast } = useToast();
  const { isPremium, hasActiveTrial, trialDaysRemaining, subscribe, startFreeTrial, usage } = useSecureSubscription();
  const { isOnline: offlineStatus } = useOfflineStorage();
  const { isHighContrast, toggleHighContrast } = useTheme();

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
      // Update photos to scanning status
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

      // Update photo statuses based on scan results
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

      // Reset photos to pending status
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

  // Register service worker
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Keyboard shortcuts
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
      // Trigger file upload
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
    // Here you would typically unlock premium features or navigate to premium content
  };

  const handleFilesAdded = useCallback((files: File[]) => {
    const newPhotos: PhotoItem[] = files.map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      status: "pending",
      fileSize: file.size,
      file: file, // Store the file for scanning
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap min-w-0 flex-1">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold truncate min-w-0">Private Photo Guardian</h1>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isPremium && <PremiumBadge size="sm" text="PRO" />}
                {hasActiveTrial && (
                  <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs px-1 py-0" size="sm">
                    {trialDaysRemaining}d
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <HighContrastToggle 
                className="p-1 sm:p-2 h-auto w-auto text-muted-foreground hover:text-foreground transition-colors"
              />
              {isOnline ? (
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowVault(true)}
                className="p-1 sm:p-2 h-auto w-auto"
                aria-label="Open vault"
              >
                <Vault className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 sm:p-2 h-auto w-auto" aria-label="Settings">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Upload Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="mb-4">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Upload Photos</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add photos to scan for sensitive content
              </p>
              
              {/* Usage Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className="text-center p-1.5 bg-gray-50 rounded-lg min-w-0">
                  <p className="text-xs text-gray-500 truncate">Storage</p>
                  <p className="text-xs font-medium truncate" title={`${Math.round(usage.storageUsed / (1024 * 1024))}MB / ${Math.round(usage.storageLimit / (1024 * 1024))}MB`}>
                    {Math.round(usage.storageUsed / (1024 * 1024))}MB / {Math.round(usage.storageLimit / (1024 * 1024))}MB
                  </p>
                </div>
                <div className="text-center p-1.5 bg-gray-50 rounded-lg min-w-0">
                  <p className="text-xs text-gray-500 truncate">Scans</p>
                  <p className="text-xs font-medium truncate" title={`${usage.photosScanned} / ${usage.scanLimit}`}>
                    {usage.photosScanned} / {usage.scanLimit}
                  </p>
                </div>
                <div className="text-center p-1.5 bg-gray-50 rounded-lg min-w-0">
                  <p className="text-xs text-gray-500 truncate">AI Tags</p>
                  <p className="text-xs font-medium truncate" title={`${usage.aiTagsGenerated} / ${usage.aiTagLimit}`}>
                    {usage.aiTagsGenerated} / {usage.aiTagLimit}
                  </p>
                </div>
                <div className="text-center p-1.5 bg-gray-50 rounded-lg min-w-0">
                  <p className="text-xs text-gray-500 truncate">Status</p>
                  <p className="text-xs font-medium text-green-600 truncate">
                    {offlineStatus ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
            
            <DropZone onFilesAdded={handleFilesAdded} />
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={startScanning}
                disabled={isScanning || photos.filter(p => p.status === "pending").length === 0}
                className="w-full sm:w-auto"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isScanning ? "Scanning..." : "Start Scanning"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scanning Progress */}
        {isScanning && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Scanning Photos</h3>
                  <span className="text-sm text-muted-foreground">{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
                {currentScanningPhoto && (
                  <p className="text-sm text-muted-foreground truncate" title={`Currently scanning: ${currentScanningPhoto}`}>
                    Currently scanning: {currentScanningPhoto}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Using AI to analyze photos for sensitive content...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 gap-1 sm:gap-2 h-auto min-h-[60px] sm:min-h-[48px] p-1 sm:p-2 bg-muted/50 rounded-lg">
            <TabsTrigger value="gallery" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px] sm:min-h-[36px] data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200">
              <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate text-center">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px] sm:min-h-[36px] data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate text-center">AI Org</span>
            </TabsTrigger>
            <TabsTrigger value="ondevice" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px] sm:min-h-[36px] data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200">
              <Cpu className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate text-center">On-Device</span>
            </TabsTrigger>
            <TabsTrigger value="multimodel" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px] sm:min-h-[36px] data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200">
              <Network className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate text-center">Multi-Model AI</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px] sm:min-h-[36px] data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate text-center">Premium</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px] sm:min-h-[36px] data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate text-center">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            <AIEnhancedPhotoManager
              photos={photos}
              onPhotosUpdate={setPhotos}
              isPremium={isPremium}
            />
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
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
              <h2 className="text-2xl font-bold mb-2">V.AI GLM 4.5 On-Device Analysis</h2>
              <p className="text-gray-600">
                Analyze photos directly on your device with advanced AI - no server required
              </p>
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
              <h2 className="text-2xl font-bold mb-2">Multi-Model AI Analysis</h2>
              <p className="text-gray-600">
                Advanced analysis with GLM-4.5V, AIR, and ensemble AI capabilities
              </p>
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
              <Card>
                <CardContent className="p-12 text-center">
                  <Network className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Photos for Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload photos to enable multi-model AI analysis
                  </p>
                  <Button onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Unlock Premium Features</h2>
                  <p className="text-gray-400 mb-6">
                    Experience infinite space, intelligent control, and unbreakable security
                  </p>

                  {isPremium ? (
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">
                          Premium Active
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2">✓ Unlimited Storage</h3>
                          <p className="text-sm text-gray-600">Endless encrypted cloud space</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2">✓ AI Organization</h3>
                          <p className="text-sm text-gray-600">Smart tagging and search</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2">✓ Advanced Security</h3>
                          <p className="text-sm text-gray-600">Biometric vault protection</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2">✓ Priority Support</h3>
                          <p className="text-sm text-gray-600">24/7 premium assistance</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hasActiveTrial ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">
                            {trialDaysRemaining} days left in trial
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                          <Sparkles className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">
                            30-day free trial available
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2 text-purple-600">Unlimited Storage</h3>
                          <p className="text-sm text-gray-600">From 500MB to 1TB cloud space</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2 text-blue-600">AI Organization</h3>
                          <p className="text-sm text-gray-600">Smart tagging and face recognition</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2 text-green-600">Advanced Security</h3>
                          <p className="text-sm text-gray-600">Military-grade encryption</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2 text-orange-600">Premium Themes</h3>
                          <p className="text-sm text-gray-600">Exclusive customization options</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => setShowPINPad(true)}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                        >
                          {hasActiveTrial ? "Upgrade Now" : "Start Free Trial"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowVault(true)}
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
            {/* Temporarily disabled due to syntax errors */}
            {/* <SecurityDashboard /> */}
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Security dashboard temporarily disabled for maintenance</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
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