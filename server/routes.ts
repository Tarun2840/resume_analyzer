import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
// @ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { analyzeResumeWithAI } from "./services/gemini";
import { insertResumeAnalysisSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and analyze resume
  app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Extract text from PDF
      const pdfData = await pdfParse(req.file.buffer);
      const resumeText = pdfData.text;

      if (!resumeText.trim()) {
        return res.status(400).json({ message: "Could not extract text from PDF" });
      }

      // Analyze with AI
      const analysis = await analyzeResumeWithAI(resumeText);

      // Save to database
      const resumeAnalysis = await storage.createResumeAnalysis({
        fileName: req.file.originalname,
        personalDetails: analysis.personalDetails,
        resumeContent: analysis.resumeContent,
        skills: analysis.skills,
        aiFeedback: analysis.aiFeedback,
        overallScore: analysis.aiFeedback.rating,
      });

      res.json(resumeAnalysis);
    } catch (error) {
      console.error("Resume analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze resume"
      });
    }
  });

  // Get all resume analyses
  app.get("/api/resume-analyses", async (req, res) => {
    try {
      const analyses = await storage.getResumeAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Failed to fetch resume analyses:", error);
      res.status(500).json({ message: "Failed to fetch resume analyses" });
    }
  });

  // Get specific resume analysis
  app.get("/api/resume-analyses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getResumeAnalysisById(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Resume analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Failed to fetch resume analysis:", error);
      res.status(500).json({ message: "Failed to fetch resume analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
