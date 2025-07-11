
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

export const ProfilePictureUpload = ({ currentAvatar, username, onAvatarUpdate }: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create a temporary URL for the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarUrl = e.target?.result as string;
        onAvatarUpdate(newAvatarUrl);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully!",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={currentAvatar} alt={username} />
              <AvatarFallback className="text-xl">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
              <Camera className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">{username}</h3>
            <p className="text-sm text-muted-foreground">
              Click below to update your profile picture
            </p>
          </div>

          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="avatar-upload"
              disabled={uploading}
            />
            <Button
              asChild
              className="w-full"
              disabled={uploading}
            >
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {uploading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </>
                )}
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
