import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";
import AnalysisResults from "./analysis-results";
import type { ResumeAnalysis } from "@shared/schema";

interface DetailsModalProps {
  analysis: ResumeAnalysis;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailsModal({ analysis, isOpen, onClose }: DetailsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto" data-testid="details-modal">
        <DialogHeader className="sticky top-0 bg-background border-b border-border pb-4 mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Resume Analysis Details</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-modal">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {analysis.personalDetails?.name || "Unknown"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {analysis.personalDetails?.email || "No email"} • Analyzed {formatDate(analysis.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent" data-testid="modal-score">
                {analysis.overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <AnalysisResults analysis={analysis} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
