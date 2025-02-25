import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wand2, 
  Scissors, 
  Sparkles,
  Upload,
  Download
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-primary mb-6">
              WitchyCraft
            </h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Enchant your videos with magical editing powers
            </p>
            <Link href="/editor">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Wand2 className="mr-2 h-5 w-5" />
                Start Crafting
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Animated background particles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Magical Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Scissors className="h-8 w-8" />}
              title="Cut & Trim"
              description="Precisely trim and cut your videos with magical accuracy"
            />
            <FeatureCard
              icon={<Wand2 className="h-8 w-8" />}
              title="Effects"
              description="Add mystical effects and transitions to your videos"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="Filters"
              description="Transform your videos with enchanted filters"
            />
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Begin Your Journey
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <Card className="w-full md:w-72">
              <CardContent className="pt-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload</h3>
                <p className="text-muted-foreground">
                  Upload your video to begin the enchantment
                </p>
              </CardContent>
            </Card>
            <Card className="w-full md:w-72">
              <CardContent className="pt-6 text-center">
                <Wand2 className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Edit</h3>
                <p className="text-muted-foreground">
                  Apply magical effects and transformations
                </p>
              </CardContent>
            </Card>
            <Card className="w-full md:w-72">
              <CardContent className="pt-6 text-center">
                <Download className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Export</h3>
                <p className="text-muted-foreground">
                  Download your enchanted creation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="relative overflow-hidden group">
      <CardContent className="pt-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-4 text-primary">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </motion.div>
      </CardContent>
    </Card>
  );
}