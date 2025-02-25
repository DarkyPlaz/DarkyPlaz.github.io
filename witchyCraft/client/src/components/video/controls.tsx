import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Scissors,
  Combine,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ControlsProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onCut: () => void;
  onTogglePlay?: () => void;
}

export default function Controls({ 
  currentTime, 
  duration, 
  onSeek, 
  isPlaying,
  onCut,
  onTogglePlay 
}: ControlsProps) {
  const { toast } = useToast();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const handleMerge = () => {
    toast({
      title: "Merge clips",
      description: "Select clips to merge",
    });
  };

  const handleRotate = (direction: 'left' | 'right') => {
    toast({
      title: `Rotate ${direction}`,
      description: `Rotating video ${direction}`,
    });
  };

  const handleZoom = (type: 'in' | 'out') => {
    toast({
      title: `Zoom ${type}`,
      description: `Zooming ${type} on video`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button 
          size="icon"
          variant="secondary"
          className="h-12 w-12"
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          title="Cut video"
          onClick={onCut}
        >
          <Scissors className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          title="Merge clips"
          onClick={handleMerge}
        >
          <Combine className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          title="Rotate left"
          onClick={() => handleRotate('left')}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          title="Rotate right"
          onClick={() => handleRotate('right')}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          title="Zoom in"
          onClick={() => handleZoom('in')}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          title="Zoom out"
          onClick={() => handleZoom('out')}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground min-w-[100px]">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.001}
          className="flex-1"
          onValueChange={(value) => onSeek(value[0])}
        />
        <span className="text-sm text-muted-foreground min-w-[100px]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}