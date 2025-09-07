import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, Download, User, Search } from "lucide-react";
import DetailsModal from "./details-modal";
import type { ResumeAnalysis } from "@shared/schema";

interface HistoricalViewerProps {
  analyses: ResumeAnalysis[];
}

export default function HistoricalViewer({ analyses }: HistoricalViewerProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const filteredAnalyses = analyses
    .filter((analysis) => {
      const matchesSearch = 
        analysis.personalDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.personalDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesScore = scoreFilter === "all" || 
        (scoreFilter === "9-10" && analysis.overallScore >= 9) ||
        (scoreFilter === "8-9" && analysis.overallScore >= 8 && analysis.overallScore < 9) ||
        (scoreFilter === "7-8" && analysis.overallScore >= 7 && analysis.overallScore < 8) ||
        (scoreFilter === "below-7" && analysis.overallScore < 7);

      return matchesSearch && matchesScore;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.overallScore - a.overallScore;
        case "lowest":
          return a.overallScore - b.overallScore;
        case "name":
          return (a.personalDetails?.name || "").localeCompare(b.personalDetails?.name || "");
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Filters and Search */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  data-testid="search-input"
                />
              </div>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-40" data-testid="score-filter">
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="9-10">9.0 - 10.0</SelectItem>
                  <SelectItem value="8-9">8.0 - 8.9</SelectItem>
                  <SelectItem value="7-8">7.0 - 7.9</SelectItem>
                  <SelectItem value="below-7">Below 7.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" data-testid="sort-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Score</SelectItem>
                  <SelectItem value="lowest">Lowest Score</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Data Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle>Resume Analysis History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAnalyses.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No analyses found</h3>
              <p className="text-muted-foreground">
                {analyses.length === 0 
                  ? "Upload your first resume to get started."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Analyzed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.id} className="hover:bg-muted/30" data-testid={`row-analysis-${analysis.id}`}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <User className="text-primary h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {analysis.personalDetails?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {analysis.personalDetails?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="text-red-500 mr-2 h-4 w-4" />
                          <span className="text-sm text-foreground">{analysis.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-accent">
                            {analysis.overallScore.toFixed(1)}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">/ 10</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(analysis.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedAnalysis(analysis)}
                            data-testid={`button-details-${analysis.id}`}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Details
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-export-${analysis.id}`}>
                            <Download className="mr-1 h-3 w-3" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredAnalyses.length > 0 && (
            <div className="bg-muted/30 px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">1-{filteredAnalyses.length}</span> of{" "}
                  <span className="font-medium text-foreground">{analyses.length}</span> results
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedAnalysis && (
        <DetailsModal
          analysis={selectedAnalysis}
          isOpen={!!selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </>
  );
}
