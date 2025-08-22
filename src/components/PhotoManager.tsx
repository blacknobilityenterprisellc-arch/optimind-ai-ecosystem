"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage, PhotoGrid } from "./OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  SortAsc, 
  SortDesc, 
  Download, 
  Trash2, 
  Archive, 
  Grid, 
  List,
  MoreVertical,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoItem {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: Date;
  fileSize: number;
  confidence?: number;
  categories?: string[];
  selected?: boolean;
}

interface PhotoManagerProps {
  photos: PhotoItem[];
  onPhotosUpdate: (photos: PhotoItem[]) => void;
  isPremium: boolean;
}

type SortOption = "name" | "date" | "size" | "status" | "confidence";
type SortDirection = "asc" | "desc";
type ViewMode = "grid" | "list";

export function PhotoManager({ photos, onPhotosUpdate, isPremium }: PhotoManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const { toast } = useToast();

  // Filter and sort photos
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = photos.filter(photo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          photo.name.toLowerCase().includes(query) ||
          photo.categories?.some(cat => cat.toLowerCase().includes(query))
        );
      }
      
      // Status filter
      if (statusFilter !== "all" && photo.status !== statusFilter) {
        return false;
      }
      
      return true;
    });

    // Sort photos
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "date":
          aValue = a.scanDate ? new Date(a.scanDate).getTime() : 0;
          bValue = b.scanDate ? new Date(b.scanDate).getTime() : 0;
          break;
        case "size":
          aValue = a.fileSize;
          bValue = b.fileSize;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "confidence":
          aValue = a.confidence || 0;
          bValue = b.confidence || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [photos, searchQuery, sortBy, sortDirection, statusFilter]);

  const selectedPhotos = photos.filter(photo => photo.selected);
  const hasSelectedPhotos = selectedPhotos.length > 0;

  const handleSelectPhoto = useCallback((photoId: string, selected: boolean) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, selected } : photo
    );
    onPhotosUpdate(updatedPhotos);
    setShowBulkActions(updatedPhotos.some(p => p.selected));
  }, [photos, onPhotosUpdate]);

  const handleSelectAll = useCallback((selected: boolean) => {
    const updatedPhotos = photos.map(photo => ({ ...photo, selected }));
    onPhotosUpdate(updatedPhotos);
    setShowBulkActions(selected);
  }, [photos, onPhotosUpdate]);

  const handleBulkAction = useCallback((action: string) => {
    const selectedPhotoIds = selectedPhotos.map(p => p.id);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${selectedPhotoIds.length} photos?`)) {
          const updatedPhotos = photos.filter(photo => !photo.selected);
          onPhotosUpdate(updatedPhotos);
          toast({
            title: "Photos Deleted",
            description: `Successfully deleted ${selectedPhotoIds.length} photos`,
          });
        }
        break;
        
      case "archive":
        const archivedPhotos = photos.map(photo =>
          photo.selected ? { ...photo, categories: [...(photo.categories || []), "archived"] } : photo
        );
        onPhotosUpdate(archivedPhotos);
        toast({
          title: "Photos Archived",
          description: `Successfully archived ${selectedPhotoIds.length} photos`,
        });
        break;
        
      case "download":
        if (!isPremium) {
          toast({
            title: "Premium Feature",
            description: "Bulk download is available for premium users only",
            variant: "destructive",
          });
          return;
        }
        
        // Simulate download
        selectedPhotos.forEach(photo => {
          const link = document.createElement('a');
          link.href = photo.url;
          link.download = photo.name;
          link.click();
        });
        
        toast({
          title: "Download Started",
          description: `Downloading ${selectedPhotoIds.length} photos`,
        });
        break;
        
      case "clear-selection":
        const clearedPhotos = photos.map(photo => ({ ...photo, selected: false }));
        onPhotosUpdate(clearedPhotos);
        setShowBulkActions(false);
        break;
    }
  }, [selectedPhotos, photos, onPhotosUpdate, toast, isPremium]);

  const getStatusIcon = (status: PhotoItem["status"]) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "scanning":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: PhotoItem["status"]) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-200";
      case "flagged":
        return "bg-red-100 text-red-800 border-red-200";
      case "scanning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not scanned";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search photos by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 flex-shrink-0">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scanning">Scanning</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Sort by Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Sort by Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>
                  Sort by Size
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>
                  Sort by Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("confidence")}>
                  Sort by Confidence
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Direction */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              {sortDirection === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>

            {/* View Mode */}
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-shrink-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-shrink-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {showBulkActions && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <Checkbox
                  checked={selectedPhotos.length === filteredAndSortedPhotos.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium truncate">
                  {selectedPhotos.length} of {filteredAndSortedPhotos.length} photos selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                  className="flex-shrink-0"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("download")}
                  disabled={!isPremium}
                  className="flex-shrink-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction("clear-selection")}
                  className="flex-shrink-0"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredAndSortedPhotos.length} of {photos.length} photos</span>
        {searchQuery && (
          <span>Filtered by: "{searchQuery}"</span>
        )}
      </div>

      {/* Photo Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSortedPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Photo */}
                <div className="relative aspect-square bg-gray-100">
                  <OptimizedImage
                    src={photo.url}
                    alt={photo.name}
                    width={300}
                    height={300}
                    aspectRatio={1}
                    className="w-full h-full"
                  />
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={photo.selected}
                      onCheckedChange={(checked) => handleSelectPhoto(photo.id, checked as boolean)}
                      className="bg-white/80 backdrop-blur"
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-1 right-1 max-w-[60px]">
                    <Badge className={`text-xs ${getStatusColor(photo.status)} leading-none`} size="sm">
                      {getStatusIcon(photo.status)}
                      <span className="ml-0.5 truncate block">{photo.status}</span>
                    </Badge>
                  </div>

                  {/* Confidence Score */}
                  {photo.confidence && (
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="outline" className="text-xs bg-white/80 backdrop-blur leading-none whitespace-nowrap" size="sm">
                        {Math.round(photo.confidence * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Photo Info */}
                <div className="p-2 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-medium truncate flex-1 min-w-0" title={photo.name}>
                      {photo.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSelectPhoto(photo.id, !photo.selected)}>
                          {photo.selected ? "Deselect" : "Select"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const link = document.createElement('a');
                          link.href = photo.url;
                          link.download = photo.name;
                          link.click();
                        }}>
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            const updatedPhotos = photos.map(p =>
                              p.id === photo.id ? { ...p, categories: [...(p.categories || []), "archived"] } : p
                            );
                            onPhotosUpdate(updatedPhotos);
                          }}
                        >
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            if (confirm(`Delete "${photo.name}"?`)) {
                              const updatedPhotos = photos.filter(p => p.id !== photo.id);
                              onPhotosUpdate(updatedPhotos);
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div className="truncate leading-tight" title={formatFileSize(photo.fileSize)}>
                      {formatFileSize(photo.fileSize)}
                    </div>
                    <div className="truncate leading-tight" title={formatDate(photo.scanDate)}>
                      {formatDate(photo.scanDate)}
                    </div>
                    {photo.categories && photo.categories.length > 0 && (
                      <div className="flex flex-wrap gap-0.5">
                        {photo.categories.slice(0, 1).map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs leading-none truncate max-w-[40px] px-1 py-0" size="sm" title={category}>
                            {category.length > 5 ? category.substring(0, 5) + '..' : category}
                          </Badge>
                        ))}
                        {photo.categories.length > 1 && (
                          <Badge variant="outline" className="text-xs leading-none px-1 py-0" size="sm">
                            +{photo.categories.length - 1}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredAndSortedPhotos.map((photo) => (
            <Card key={photo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={photo.selected}
                    onCheckedChange={(checked) => handleSelectPhoto(photo.id, checked as boolean)}
                  />

                  {/* Photo Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={photo.url}
                      alt={photo.name}
                      width={64}
                      height={64}
                      aspectRatio={1}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Photo Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-medium truncate">{photo.name}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0 max-w-[80px]">
                        <Badge className={`text-xs ${getStatusColor(photo.status)} leading-none`} size="sm">
                          {getStatusIcon(photo.status)}
                          <span className="ml-0.5 truncate block">{photo.status}</span>
                        </Badge>
                        {photo.confidence && (
                          <Badge variant="outline" className="text-xs leading-none whitespace-nowrap" size="sm">
                            {Math.round(photo.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500 flex-wrap leading-tight">
                      <span className="truncate" title={formatFileSize(photo.fileSize)}>
                        {formatFileSize(photo.fileSize)}
                      </span>
                      <span className="truncate" title={formatDate(photo.scanDate)}>
                        {formatDate(photo.scanDate)}
                      </span>
                      {photo.categories && photo.categories.length > 0 && (
                        <div className="flex flex-wrap gap-0.5">
                          {photo.categories.slice(0, 1).map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs leading-none truncate max-w-[40px] px-1 py-0" size="sm" title={category}>
                              {category.length > 5 ? category.substring(0, 5) + '..' : category}
                            </Badge>
                          ))}
                          {photo.categories.length > 1 && (
                            <Badge variant="outline" className="text-xs leading-none px-1 py-0" size="sm">
                              +{photo.categories.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = photo.url;
                        link.download = photo.name;
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSelectPhoto(photo.id, !photo.selected)}>
                          {photo.selected ? "Deselect" : "Select"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const updatedPhotos = photos.map(p =>
                            p.id === photo.id ? { ...p, categories: [...(p.categories || []), "archived"] } : p
                          );
                          onPhotosUpdate(updatedPhotos);
                        }}>
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            if (confirm(`Delete "${photo.name}"?`)) {
                              const updatedPhotos = photos.filter(p => p.id !== photo.id);
                              onPhotosUpdate(updatedPhotos);
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedPhotos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search or filters" : "Upload some photos to get started"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}