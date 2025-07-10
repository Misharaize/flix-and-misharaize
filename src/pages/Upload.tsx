
import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload as UploadIcon, X, Video, Image, Tags, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Upload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: "Video file must be under 100MB",
          variant: "destructive"
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Thumbnail must be under 5MB",
          variant: "destructive"
        });
        return;
      }
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Video uploaded successfully!",
        description: "Your video is now processing and will be available soon.",
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>You need to be logged in to upload videos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your Video</h1>
            <p className="text-muted-foreground">
              Share your creativity with the MISHARAIZE FLIX community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Upload Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Video className="h-5 w-5" />
                      <span>Video File</span>
                    </CardTitle>
                    <CardDescription>
                      Upload your video file (MP4, AVI, MOV - Max 100MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      {videoFile ? (
                        <div className="space-y-4">
                          <Video className="h-12 w-12 text-primary mx-auto" />
                          <div>
                            <p className="font-medium">{videoFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setVideoFile(null)}
                          >
                            Change Video
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                          <div>
                            <p className="font-medium">Drop your video here or click to browse</p>
                            <p className="text-sm text-muted-foreground">MP4, AVI, MOV up to 100MB</p>
                          </div>
                          <Label htmlFor="video-upload">
                            <Button type="button" variant="outline" asChild>
                              <span>Select Video</span>
                            </Button>
                          </Label>
                        </div>
                      )}
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Video Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Video Details</CardTitle>
                    <CardDescription>
                      Provide information about your video
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter video title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground">{title.length}/100</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your video..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        maxLength={2000}
                      />
                      <p className="text-xs text-muted-foreground">{description.length}/2000</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="flex items-center space-x-2">
                        <Tags className="h-4 w-4" />
                        <span>Tags</span>
                      </Label>
                      <Input
                        id="tags"
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagAdd}
                      />
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Tags help people discover your video ({tags.length}/10)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Thumbnail Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Image className="h-5 w-5" />
                      <span>Thumbnail</span>
                    </CardTitle>
                    <CardDescription>
                      Upload a custom thumbnail (optional)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      {thumbnail ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="Thumbnail preview"
                            className="w-full aspect-video object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setThumbnail(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Image className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-sm">Upload thumbnail</p>
                          <Label htmlFor="thumbnail-upload">
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>Browse</span>
                            </Button>
                          </Label>
                        </div>
                      )}
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Upload Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Visibility</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <input type="radio" name="visibility" value="public" defaultChecked />
                        <span>Public</span>
                      </Label>
                      <Label className="flex items-center space-x-2">
                        <input type="radio" name="visibility" value="unlisted" />
                        <span>Unlisted</span>
                      </Label>
                      <Label className="flex items-center space-x-2">
                        <input type="radio" name="visibility" value="private" />
                        <span>Private</span>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload Button */}
                <Card>
                  <CardContent className="p-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!videoFile || !title.trim() || isUploading}
                      size="lg"
                    >
                      {isUploading ? (
                        <>
                          <UploadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="mr-2 h-4 w-4" />
                          Upload Video
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
