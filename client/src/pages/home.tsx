import { useState } from "react";
import { FileText, User, Calendar, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadSection from "@/components/upload-section";
import AnalysisResults from "@/components/analysis-results";
import HistoricalViewer from "@/components/historical-viewer";
import { useQuery } from "@tanstack/react-query";
import type { ResumeAnalysis } from "@shared/schema";

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);

  const { data: analyses = [] } = useQuery<ResumeAnalysis[]>({
    queryKey: ["/api/resume-analyses"],
  });

  const stats = {
    total: analyses.length,
    averageScore: analyses.length > 0 
      ? (analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length).toFixed(1)
      : "0.0",
    thisMonth: analyses.filter(a => {
      const analysisDate = new Date(a.createdAt);
      const now = new Date();
      return analysisDate.getMonth() === now.getMonth() && 
             analysisDate.getFullYear() === now.getFullYear();
    }).length,
    topScore: analyses.length > 0 
      ? Math.max(...analyses.map(a => a.overallScore)).toFixed(1)
      : "0.0"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Resume Analyzer</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Resume Analysis Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Welcome back, User</p>
                <p className="text-xs text-muted-foreground">Professional Plan</p>
              </div>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="text-secondary-foreground text-sm" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-2"
              data-testid="tab-analysis"
            >
              <FileText className="w-4 h-4" />
              Live Resume Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2"
              data-testid="tab-history"
            >
              <Calendar className="w-4 h-4" />
              Historical Viewer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-8">
            <div className="space-y-8">
              <UploadSection onAnalysisComplete={setCurrentAnalysis} />
              {currentAnalysis && (
                <AnalysisResults analysis={currentAnalysis} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-total">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-average">
                      {stats.averageScore}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Trophy className="text-accent" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-month">
                      {stats.thisMonth}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-secondary/60 rounded-lg flex items-center justify-center">
                    <Calendar className="text-secondary-foreground" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Top Score</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-top">
                      {stats.topScore}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Trophy className="text-accent" />
                  </div>
                </div>
              </div>
            </div>

            <HistoricalViewer analyses={analyses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
