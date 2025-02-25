import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Type, Video, Lock, Eye, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Track } from "@shared/schema";

interface TimelineProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  tracks: Track[];
  onTrackSelect: (id: string | null) => void;
  selectedTrackId: string | null;
}

export default function Timeline({ 
  duration, 
  currentTime, 
  onSeek,
  tracks,
  onTrackSelect,
  selectedTrackId
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, clipId: "" });
  const [isResizing, setIsResizing] = useState({ active: false, edge: "left", clipId: "" });
  const [scrollPosition, setScrollPosition] = useState(0);

  // Format time as HH:MM:SS:FF (hours:minutes:seconds:frames)
  const formatTimecode = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30); // Assuming 30fps
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const getPositionStyle = (time: number) => {
    return `${(time / duration) * 100 * zoom}%`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || isDragging || isResizing.active) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left + scrollPosition);
    const percentage = x / (rect.width * zoom);
    const clickedTime = Math.max(0, Math.min(percentage * duration, duration));
    onSeek(clickedTime);
  };

  // Handle clip dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const percentage = x / (rect.width * zoom);
      const newTime = Math.max(0, Math.min(percentage * duration, duration));

      // Update clip position
      const updatedTracks = tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id === dragOffset.clipId) {
            const clipDuration = clip.endTime - clip.startTime;
            return {
              ...clip,
              startTime: newTime,
              endTime: newTime + clipDuration
            };
          }
          return clip;
        })
      }));

      // Update tracks state through parent
      // You'll need to add this prop to handle track updates
      // onTracksUpdate(updatedTracks);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => setIsDragging(false));
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', () => setIsDragging(false));
    };
  }, [isDragging, dragOffset, zoom, duration]);

  // Handle clip resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.active || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + scrollPosition;
      const percentage = x / (rect.width * zoom);
      const newTime = Math.max(0, Math.min(percentage * duration, duration));

      // Update clip size
      const updatedTracks = tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id === isResizing.clipId) {
            if (isResizing.edge === "left") {
              return {
                ...clip,
                startTime: Math.min(newTime, clip.endTime - 0.1)
              };
            } else {
              return {
                ...clip,
                endTime: Math.max(newTime, clip.startTime + 0.1)
              };
            }
          }
          return clip;
        })
      }));

      // onTracksUpdate(updatedTracks);
    };

    if (isResizing.active) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => setIsResizing({ active: false, edge: "left", clipId: "" }));
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', () => setIsResizing({ active: false, edge: "left", clipId: "" }));
    };
  }, [isResizing, zoom, duration]);

  return (
    <div className="h-full flex flex-col select-none bg-card">
      {/* Timeline header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Timeline</span>
          <span className="text-sm text-muted-foreground font-mono">
            {formatTimecode(currentTime)} / {formatTimecode(duration)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoom]}
              min={0.5}
              max={2}
              step={0.1}
              className="w-32"
              onValueChange={([value]) => setZoom(value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Track type buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onTrackSelect(null)}>
              <Video className="h-4 w-4 mr-2" />
              Video Track
            </Button>
            <Button variant="outline" size="sm" onClick={() => onTrackSelect(null)}>
              <Volume2 className="h-4 w-4 mr-2" />
              Audio Track
            </Button>
            <Button variant="outline" size="sm" onClick={() => onTrackSelect(null)}>
              <Type className="h-4 w-4 mr-2" />
              Text Track
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea 
          className="h-full"
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          <div className="p-4" ref={timelineRef}>
            {/* Time ruler */}
            <div className="h-8 relative border-b mb-4">
              {/* Major time markers (seconds) */}
              {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-full border-l border-border"
                  style={{ left: getPositionStyle(i) }}
                >
                  <span className="absolute bottom-1 left-1 text-xs text-muted-foreground font-mono">
                    {formatTimecode(i)}
                  </span>
                </div>
              ))}

              {/* Frame markers */}
              {Array.from({ length: Math.ceil(duration * 30) }).map((_, i) => (
                <div
                  key={`frame-${i}`}
                  className="absolute h-1/3 border-l border-border/30"
                  style={{ left: getPositionStyle(i / 30) }}
                />
              ))}

              {/* Playhead */}
              <motion.div 
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-30"
                style={{ left: getPositionStyle(currentTime) }}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
              </motion.div>
            </div>

            {/* Tracks */}
            <div className="space-y-1">
              <AnimatePresence>
                {tracks.map((track) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`relative group border rounded-md ${
                      selectedTrackId === track.id ? 'border-primary' : 'border-border'
                    }`}
                    onClick={() => onTrackSelect(track.id)}
                  >
                    <div className="flex">
                      {/* Track header */}
                      <div className="w-48 bg-card p-2 border-r flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Lock className="h-4 w-4" />
                          </Button>
                        </div>
                        {track.type === "video" && <Video className="h-4 w-4" />}
                        {track.type === "audio" && <Volume2 className="h-4 w-4" />}
                        {track.type === "text" && <Type className="h-4 w-4" />}
                        <span className="text-sm font-medium truncate">
                          {track.type.charAt(0).toUpperCase() + track.type.slice(1)} Track
                        </span>
                      </div>

                      {/* Track content */}
                      <div 
                        className="flex-1 relative h-24 bg-muted/30"
                        style={{ width: `${100 * zoom}%` }}
                        onClick={handleTimelineClick}
                      >
                        {/* Clips */}
                        {track.clips.map((clip) => (
                          <motion.div
                            key={clip.id}
                            className="absolute h-full bg-primary/20 border border-primary rounded-sm overflow-hidden group/clip cursor-move"
                            style={{
                              left: getPositionStyle(clip.startTime),
                              width: `${((clip.endTime - clip.startTime) / duration) * 100 * zoom}%`
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setIsDragging(true);
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDragOffset({ 
                                x: e.clientX - rect.left,
                                clipId: clip.id 
                              });
                            }}
                          >
                            {/* Clip content */}
                            <div className="w-full h-full">
                              {track.type === "video" && (
                                <video
                                  src={clip.source}
                                  className="w-full h-full object-cover opacity-50"
                                />
                              )}
                              {track.type === "audio" && (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                  <Volume2 className="h-6 w-6 text-primary/50" />
                                </div>
                              )}
                            </div>

                            {/* Clip duration label */}
                            <div className="absolute top-0 left-0 right-0 bg-primary/30 px-2 py-0.5 text-xs font-mono">
                              {formatTimecode(clip.endTime - clip.startTime)}
                            </div>

                            {/* Resize handles */}
                            <motion.div 
                              className="absolute left-0 top-0 w-2 h-full cursor-w-resize hover:bg-primary group-hover/clip:opacity-100 opacity-0 transition-opacity"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setIsResizing({ 
                                  active: true, 
                                  edge: "left",
                                  clipId: clip.id 
                                });
                              }}
                            />
                            <motion.div 
                              className="absolute right-0 top-0 w-2 h-full cursor-e-resize hover:bg-primary group-hover/clip:opacity-100 opacity-0 transition-opacity"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setIsResizing({ 
                                  active: true, 
                                  edge: "right",
                                  clipId: clip.id 
                                });
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}