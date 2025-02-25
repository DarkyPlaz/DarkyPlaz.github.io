import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timeline from "@/components/video/timeline";
import Controls from "@/components/video/controls";
import EffectsPanel from "@/components/video/effects-panel";
import { Upload, Download, Files } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import type { Track } from "@shared/schema";

export default function EditorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setCurrentTime(0);
    setIsPlaying(false);

    const video = document.createElement('video');
    video.src = url;
    await new Promise((resolve) => {
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
        resolve(null);
      });
    });

    const initialTrack: Track = {
      id: nanoid(),
      type: "video",
      startTime: 0,
      endTime: video.duration,
      clips: [{
        id: nanoid(),
        source: url,
        startTime: 0,
        endTime: video.duration,
        effects: []
      }]
    };

    setTracks([initialTrack]);
    setSelectedTrackId(initialTrack.id);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }

    toast({
      title: "Video uploaded",
      description: "Your video is ready for editing",
    });
  };

  const handleTracksUpdate = (updatedTracks: Track[]) => {
    setTracks(updatedTracks);
  };

  const handleCut = () => {
    if (!selectedTrackId || !videoUrl) return;

    const track = tracks.find(t => t.id === selectedTrackId);
    if (!track) return;

    const currentClip = track.clips.find(clip => 
      currentTime >= clip.startTime && currentTime <= clip.endTime
    );

    if (!currentClip) return;

    const newClips = track.clips.flatMap(clip => {
      if (clip.id === currentClip.id) {
        return [
          {
            ...clip,
            endTime: currentTime
          },
          {
            id: nanoid(),
            source: clip.source,
            startTime: currentTime,
            endTime: clip.endTime,
            effects: [...(clip.effects || [])]
          }
        ];
      }
      return [clip];
    });

    const updatedTracks = tracks.map(t => {
      if (t.id === selectedTrackId) {
        return {
          ...t,
          clips: newClips
        };
      }
      return t;
    });

    setTracks(updatedTracks);
    toast({
      title: "Clip cut",
      description: `Cut clip at ${formatTime(currentTime)}`,
    });
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      toast({
        title: "Playback error",
        description: "There was an error playing the video",
        variant: "destructive",
      });
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b bg-card p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">WitchyCraft Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r bg-card p-4">
          <h2 className="text-sm font-medium mb-4">Media Library</h2>
          <div className="space-y-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button variant="outline" className="w-full justify-start">
                <Files className="h-4 w-4 mr-2" />
                Import Media
              </Button>
            </label>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 flex-1">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mx-auto max-w-4xl">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full"
                  playsInline
                  onError={() => {
                    toast({
                      title: "Video Error",
                      description: "Failed to load video",
                      variant: "destructive",
                    });
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 mb-2 text-muted-foreground" />
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <span className="text-muted-foreground">
                        Upload your video
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-card">
            <Controls 
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              isPlaying={isPlaying}
              onCut={handleCut}
              onTogglePlay={togglePlay}
            />
          </div>
        </div>

        <div className="w-80 border-l bg-card">
          <EffectsPanel />
        </div>
      </div>

      <div className="h-80 border-t">
        <Timeline 
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
          tracks={tracks}
          onTrackSelect={setSelectedTrackId}
          selectedTrackId={selectedTrackId}
          onTracksUpdate={handleTracksUpdate}
        />
      </div>
    </div>
  );
}