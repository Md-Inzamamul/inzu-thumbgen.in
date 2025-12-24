import { useState } from "react";
import Header from "@/components/Header";
import ThumbnailForm from "@/components/ThumbnailForm";
import ThumbnailGallery from "@/components/ThumbnailGallery";
import ThumbnailHistory from "@/components/ThumbnailHistory";
import DemoModal from "@/components/DemoModal";
import { toast } from "sonner";
import { Zap, Palette, Download, Play, Sparkles, TrendingUp, Users, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useThumbnailHistory } from "@/hooks/useThumbnailHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const { saveThumbnail, count } = useThumbnailHistory();

  const handleGenerate = async (topic: string, context: string, style: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-thumbnail", {
        body: { topic, context, style },
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "Failed to generate thumbnail");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setThumbnails((prev) => [data.imageUrl, ...prev]);
        await saveThumbnail(data.imageUrl, topic, context, style);
        toast.success("Thumbnail generated successfully!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to generate thumbnail. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Design",
      description: "Advanced AI creates eye-catching thumbnails that stand out in search results",
    },
    {
      icon: Palette,
      title: "Multiple Styles",
      description: "Choose from vibrant, minimal, dramatic, or playful design styles",
    },
    {
      icon: Download,
      title: "Instant Download",
      description: "Get your high-resolution thumbnails ready to upload in seconds",
    },
  ];

  const stats = [
    { value: "1M+", label: "Thumbnails Generated" },
    { value: "50K+", label: "Happy Creators" },
    { value: "3x", label: "Average CTR Boost" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                  <Play className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-primary">YouTube Thumbnail Magic</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                  Create <span className="text-gradient-red">Viral</span> Thumbnails with AI
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                  Transform your video ideas into high-click thumbnails that boost views and engagement. 
                  Our AI understands what makes YouTube thumbnails irresistible.
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <Button 
                    variant="youtube" 
                    size="xl"
                    onClick={scrollToGenerator}
                    className="glow-red"
                  >
                    <Zap className="h-5 w-5" />
                    Start Creating
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl"
                    onClick={() => setDemoOpen(true)}
                    className="border-2 text-primary border-primary/30 hover:bg-primary/5 hover:border-primary"
                  >
                    <Play className="h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>

                {/* Demo Modal */}
                <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />

                {/* Stats */}
                <div className="flex flex-wrap gap-8 md:gap-12">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Preview Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden soft-shadow-lg border border-border">
                  <div className="aspect-video bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Youtube className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium">Your thumbnails will appear here</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose Our <span className="text-gradient-red">Thumbnail Generator</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built specifically for YouTube creators who want professional thumbnails without the hassle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:soft-shadow soft-shadow-lg"
                >
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mb-5">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generator" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Generate Your Thumbnail
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Describe your video topic and let AI create the perfect thumbnail for you
              </p>
              {count > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mt-4">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">
                    You've generated <span className="font-bold text-primary">{count}</span> thumbnail{count !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Form */}
                <div>
                  <div className="sticky top-24 p-6 md:p-8 rounded-2xl bg-card border border-border soft-shadow-lg">
                    <ThumbnailForm onGenerate={handleGenerate} isLoading={isLoading} />
                  </div>
                </div>

                {/* Gallery / History Tabs */}
                <div>
                  <Tabs defaultValue="current" className="w-full">
                    <TabsList className="w-full mb-4 bg-muted/50">
                      <TabsTrigger value="current" className="flex-1">Current Session</TabsTrigger>
                      <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="current">
                      <ThumbnailGallery thumbnails={thumbnails} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="history">
                      <ThumbnailHistory />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">ThumbGen</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered YouTube Thumbnail Generator. Create viral thumbnails that boost your views and engagement.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3 mt-4">
                <a href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ThumbGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
