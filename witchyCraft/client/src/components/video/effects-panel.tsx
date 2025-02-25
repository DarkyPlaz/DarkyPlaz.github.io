import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles,
  Wand2,
  Type,
  Image,
  Music
} from "lucide-react";

const EFFECTS = [
  "Mystical Glow",
  "Dark Enchantment",
  "Magical Sparkles",
  "Witch's Brew",
  "Ancient Runes"
];

const TRANSITIONS = [
  "Fade",
  "Dissolve",
  "Magical Swirl",
  "Smoke",
  "Portal"
];

export default function EffectsPanel() {
  return (
    <Tabs defaultValue="effects">
      <TabsList className="w-full">
        <TabsTrigger value="effects" className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          Effects
        </TabsTrigger>
        <TabsTrigger value="text" className="flex-1">
          <Type className="h-4 w-4 mr-2" />
          Text
        </TabsTrigger>
        <TabsTrigger value="media" className="flex-1">
          <Image className="h-4 w-4 mr-2" />
          Media
        </TabsTrigger>
      </TabsList>

      <TabsContent value="effects" className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Magical Effects</h3>
          <div className="grid grid-cols-2 gap-2">
            {EFFECTS.map((effect) => (
              <Button
                key={effect}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {effect}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Transitions</h3>
          <div className="grid grid-cols-2 gap-2">
            {TRANSITIONS.map((transition) => (
              <Button
                key={transition}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {transition}
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="text">
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Type className="h-4 w-4 mr-2" />
            Add Text Layer
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="media">
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Music className="h-4 w-4 mr-2" />
            Add Music
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
