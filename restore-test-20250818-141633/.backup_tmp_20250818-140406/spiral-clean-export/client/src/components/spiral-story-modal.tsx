import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Star, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpiralStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpiralStoryModal({ isOpen, onClose }: SpiralStoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    storeName: '',
    story: '',
    photo: null as File | null
  });
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate story submission
    toast({
      title: "Story submitted successfully!",
      description: "Thank you for sharing your SPIRAL experience. It will be reviewed and may appear on our homepage.",
    });
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      storeName: '',
      story: '',
      photo: null
    });
    
    onClose();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, photo: e.dataTransfer.files[0] });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-[var(--spiral-gold)]" />
            Share Your SPIRAL Story
          </DialogTitle>
          <DialogDescription>
            Tell us about your amazing local shopping experience and inspire others in the community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your Name (First name + last initial)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sarah M."
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Your Area</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Downtown, Riverside"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div>
            <Label htmlFor="storeName">Store/Business Name</Label>
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              placeholder="e.g., Local Roasters Co., Artisan Corner"
              required
            />
          </div>

          {/* Story */}
          <div>
            <Label htmlFor="story">Your SPIRAL Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Tell us about your experience! What made it special? How did the store owners make you feel? What did you discover?"
              rows={4}
              maxLength={300}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.story.length}/300 characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Add a Photo (Optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5' 
                  : 'border-gray-300 hover:border-[var(--spiral-coral)]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.photo ? (
                <div className="space-y-2">
                  <Camera className="h-8 w-8 text-[var(--spiral-coral)] mx-auto" />
                  <p className="text-sm font-medium">{formData.photo.name}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, photo: null })}
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm">Drag and drop a photo here, or</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Card */}
          <Card className="bg-[var(--spiral-cream)] border-[var(--spiral-coral)]/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">Preview</h4>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--spiral-coral)]/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-[var(--spiral-navy)]">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{formData.name || 'Your Name'}</p>
                    <p className="text-xs text-gray-500">{formData.location || 'Your Area'}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs px-2 py-1 bg-[var(--spiral-gold)] text-white rounded-full">
                      SPIRAL Story
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic mb-2">
                  "{formData.story || 'Your story will appear here...'}"
                </p>
                <p className="text-xs text-[var(--spiral-coral)] font-medium">
                  {formData.storeName || 'Store Name'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="button-primary flex-1"
              disabled={!formData.name || !formData.location || !formData.storeName || !formData.story}
            >
              Share My Story
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}