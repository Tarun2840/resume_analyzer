import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, FileText, Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";
import type { ResumeAnalysis } from "@shared/schema";

interface UploadSectionProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

export default function UploadSection({ onAnalysisComplete }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Processing...");
  
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const analyzeResume = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress steps
    const progressSteps = [
      { progress: 20, text: "Extracting PDF content..." },
      { progress: 40, text: "Parsing resume structure..." },
      { progress: 60, text: "Analyzing with AI..." },
      { progress: 80, text: "Generating insights..." },
      { progress: 100, text: "Complete!" }
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        const step = progressSteps[stepIndex];
        setProgress(step.progress);
        setProgressText(step.text);
        stepIndex++;
      }
    }, 1000);

    try {
      const analysis = await uploadFile(selectedFile);
      onAnalysisComplete(analysis);
      
      toast({
        title: "Analysis complete!",
        description: "Your resume has been successfully analyzed.",
      });
      
      // Reset state
      setSelectedFile(null);
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
      setProgressText("Processing...");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
          <p className="text-muted-foreground">Upload a PDF file to get AI-powered analysis and feedback</p>
        </div>

        {!selectedFile && !isAnalyzing && (
          <div
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer bg-muted/20 hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => document.getElementById("file-input")?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            data-testid="upload-area"
          >
            <div className="mb-4">
              <CloudUpload className="mx-auto h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              Drop your resume here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF files up to 10MB
            </p>
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept=".pdf"
              onChange={handleFileSelect}
              data-testid="file-input"
            />
            <Button>Select File</Button>
          </div>
        )}

        {selectedFile && !isAnalyzing && (
          <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="text-red-500 text-lg" />
                <div>
                  <p className="font-medium text-foreground" data-testid="file-name">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="file-size">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button onClick={analyzeResume} data-testid="button-analyze">
                <FileText className="mr-2 h-4 w-4" />
                Analyze Resume
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-6 p-6 bg-secondary/50 border border-border rounded-lg">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Analyzing Resume...
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI is extracting and analyzing your resume content
              </p>
              <Progress value={progress} className="mb-2" />
              <p className="text-xs text-muted-foreground" data-testid="progress-text">
                {progressText}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
