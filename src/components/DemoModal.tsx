import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Type, Palette, Sparkles, Download, ChevronRight } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEMO_VIDEO_URL = ""; // Add your YouTube/Loom video ID here

const steps = [
  {
    icon: Type,
    title: "Enter Your Video Topic",
    description: "Start by typing your video topic or title. Be specific about what your video is about to get the best thumbnail suggestions.",
    tip: "Example: 'How to Build a Gaming PC in 2024'",
  },
  {
    icon: Sparkles,
    title: "Add Thumbnail Text",
    description: "In the 'Additional Context' field, describe what you want on your thumbnail. Include the exact text you want displayed.",
    tip: "Tip: Write 'Big bold text: Earn ₹10,000 Daily' for text overlays",
  },
  {
    icon: Palette,
    title: "Choose Your Style",
    description: "Select from four unique styles: Vibrant & Bold, Minimal, Dramatic, or Playful. Each style creates a different mood for your thumbnail.",
    tip: "Pro tip: Vibrant works great for gaming, Minimal for tutorials",
  },
  {
    icon: Download,
    title: "Generate & Download",
    description: "Click 'Generate Thumbnails' and wait a few seconds. Once ready, hover over your thumbnail and click the download button to save it.",
    tip: "Your thumbnails are saved in history for later access",
  },
];

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const hasVideo = DEMO_VIDEO_URL.length > 0;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-primary fill-primary" />
            </div>
            How ThumbGen Works
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {hasVideo ? (
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="w-full mb-4 bg-muted/50">
                <TabsTrigger value="video" className="flex-1">Watch Video</TabsTrigger>
                <TabsTrigger value="guide" className="flex-1">Step-by-Step Guide</TabsTrigger>
              </TabsList>
              
              <TabsContent value="video" className="mt-0">
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${DEMO_VIDEO_URL}?rel=0&modestbranding=1`}
                    title="ThumbGen Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="guide" className="mt-0">
                <StepByStepGuide 
                  currentStep={currentStep}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <StepByStepGuide 
              currentStep={currentStep}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface StepByStepGuideProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
}

const StepByStepGuide = ({ currentStep, onNext, onPrev }: StepByStepGuideProps) => {
  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="space-y-6">
      {/* Progress Indicators */}
      <div className="flex gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index < currentStep) onPrev();
              else if (index > currentStep) onNext();
            }}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index === currentStep
                ? "bg-primary"
                : index < currentStep
                ? "bg-primary/40"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="relative min-h-[280px] rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border p-8 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Step Number & Icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <StepIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-primary">Step {currentStep + 1} of {steps.length}</span>
              <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Tip Box */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">💡 </span>
              {step.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="text-muted-foreground"
        >
          Previous
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <Button
            variant="youtube"
            onClick={onNext}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="youtube"
            onClick={() => {
              const generator = document.getElementById("generator");
              generator?.scrollIntoView({ behavior: "smooth" });
            }}
            className="gap-1"
          >
            Start Creating
            <Sparkles className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DemoModal;