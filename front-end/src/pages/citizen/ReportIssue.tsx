import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Camera, MapPin, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categoryLabels, categoryIcons } from '@/data/mockData';
import type { ReportCategory, ReportPriority } from '@/types/report';

const ReportIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: (location.state?.category as ReportCategory) || '',
    priority: 'medium' as ReportPriority,
    citizenName: '',
    citizenPhone: '',
    location: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Captured",
            description: "Your current location has been recorded"
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3);
      setImages(prev => [...prev, ...newImages].slice(0, 3));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Submitted Successfully!",
        description: "Your civic issue has been reported. You'll receive updates soon.",
      });
      setLoading(false);
      navigate('../my-reports');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-civic-green/5 to-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('../')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Report Issue</h1>
              <p className="text-sm text-muted-foreground">Help improve your community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-base">Issue Type *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ReportCategory }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <span>{categoryIcons[key as ReportCategory]}</span>
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title" className="text-base">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="h-12 text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details about the issue..."
                  className="min-h-[100px] text-base"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="priority" className="text-base">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as ReportPriority }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low Priority</SelectItem>
                    <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                    <SelectItem value="high">🟠 High Priority</SelectItem>
                    <SelectItem value="critical">🔴 Critical/Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Add Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload photos</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Up to 3 photos</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full h-12"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Get Current Location
              </Button>
              
              {currentLocation && (
                <div className="p-3 bg-civic-green/10 border border-civic-green/20 rounded-lg">
                  <p className="text-sm text-civic-green">
                    📍 Location captured: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="location" className="text-base">Address *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter the exact location/address"
                  className="h-12 text-base"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <span className="text-2xl mr-2">👤</span>
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="citizenName" className="text-base">Your Name *</Label>
                <Input
                  id="citizenName"
                  value={formData.citizenName}
                  onChange={(e) => setFormData(prev => ({ ...prev, citizenName: e.target.value }))}
                  placeholder="Enter your full name"
                  className="h-12 text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="citizenPhone" className="text-base">Phone Number *</Label>
                <Input
                  id="citizenPhone"
                  type="tel"
                  value={formData.citizenPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, citizenPhone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="h-12 text-base"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-base bg-civic-green hover:bg-civic-green/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              By submitting, you agree that your information will be used to address this civic issue.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;