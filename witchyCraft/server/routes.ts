import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import archiver from "archiver";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(parseInt(req.params.id));
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  });

  app.get("/api/download", (req, res) => {
    try {
      const archive = archiver('zip');
      res.attachment('backup.zip');
      archive.pipe(res);
      
      // Add individual files
      archive.file('package.json', { name: 'package.json' });
      archive.file('tsconfig.json', { name: 'tsconfig.json' });
      
      // Add directories
      archive.directory('client/src/', 'client/src/');
      archive.directory('server/', 'server/');
      archive.directory('shared/', 'shared/');
      
      archive.finalize();
    } catch (err) {
      console.error('Backup error:', err);
      res.status(500).send('Error creating backup');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
