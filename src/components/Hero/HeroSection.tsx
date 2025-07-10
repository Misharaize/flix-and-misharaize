
import { Play, Search, Upload, Users, Video, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  const features = [
    {
      icon: Search,
      title: 'Search millions of YouTube videos',
      description: 'Discover content from across the platform'
    },
    {
      icon: Heart,
      title: 'Like, comment, and share',
      description: 'Engage with your favorite content'
    },
    {
      icon: Video,
      title: 'Watch in high quality',
      description: 'Enjoy seamless streaming experience'
    },
    {
      icon: Upload,
      title: 'Upload your own videos',
      description: 'Share your creativity with the world'
    },
    {
      icon: Users,
      title: 'Subscribe to creators',
      description: 'Follow your favorite content creators'
    },
    {
      icon: Play,
      title: 'Build custom playlists',
      description: 'Organize videos your way'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-flix-cyan/20 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative container mx-auto px-4 py-20 text-center">
        {/* Main headline */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Stream All Videos</span>
            <br />
            <span className="text-foreground">for Free</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your gateway to endless entertainment. Watch any YouTube video, create playlists, 
            comment, subscribe, and upload your own content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6 neon-glow">
              <Link to="/register">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/search">
                Browse Videos
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">∞</div>
            <div className="text-muted-foreground">Videos Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">HD</div>
            <div className="text-muted-foreground">Quality Streaming</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">0$</div>
            <div className="text-muted-foreground">Always Free</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">24/7</div>
            <div className="text-muted-foreground">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};
