import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  GraduationCap, 
  User, 
  Briefcase, 
  Code, 
  Users, 
  Award,
  FolderOpen,
  Mail,
  Phone,
  Linkedin
} from "lucide-react";
import type { ResumeAnalysis } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-8" data-testid="analysis-results">
      {/* AI Feedback Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">AI Analysis & Feedback</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-accent" data-testid="overall-score">
                {analysis.overallScore}
              </span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <Lightbulb className="text-accent mr-2 h-4 w-4" />
                Improvement Areas
              </h4>
              <ul className="space-y-2" data-testid="improvement-areas">
                {analysis.aiFeedback?.improvementAreas?.map((area, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary text-xs mt-1.5">→</span>
                    <span className="text-sm text-muted-foreground">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <GraduationCap className="text-accent mr-2 h-4 w-4" />
                Suggested Skills to Learn
              </h4>
              <div className="flex flex-wrap gap-2" data-testid="suggested-skills">
                {analysis.aiFeedback?.suggestedSkills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {analysis.aiFeedback?.summary && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground" data-testid="ai-summary">
                {analysis.aiFeedback.summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Details Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="text-primary mr-2 h-5 w-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4" data-testid="personal-details">
            <div className="space-y-3">
              {analysis.personalDetails?.name && (
                <div className="flex items-center space-x-3">
                  <User className="text-muted-foreground w-5 h-5" />
                  <span className="text-foreground font-medium">{analysis.personalDetails.name}</span>
                </div>
              )}
              {analysis.personalDetails?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="text-muted-foreground w-5 h-5" />
                  <span className="text-muted-foreground">{analysis.personalDetails.email}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {analysis.personalDetails?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="text-muted-foreground w-5 h-5" />
                  <span className="text-muted-foreground">{analysis.personalDetails.phone}</span>
                </div>
              )}
              {analysis.personalDetails?.linkedIn && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="text-muted-foreground w-5 h-5" />
                  <span className="text-muted-foreground">{analysis.personalDetails.linkedIn}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Work Experience */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="text-primary mr-2 h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-testid="work-experience">
              {analysis.resumeContent?.workExperience?.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-semibold text-foreground">{exp.title}</h4>
                  <p className="text-sm text-accent">{exp.company} • {exp.duration}</p>
                  <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                </div>
              ))}
              {(!analysis.resumeContent?.workExperience || analysis.resumeContent.workExperience.length === 0) && (
                <p className="text-sm text-muted-foreground">No work experience found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="text-primary mr-2 h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-testid="education">
              {analysis.resumeContent?.education?.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                  <p className="text-sm text-accent">{edu.institution} • {edu.duration}</p>
                  {edu.details && (
                    <p className="text-sm text-muted-foreground mt-1">{edu.details}</p>
                  )}
                </div>
              ))}
              {(!analysis.resumeContent?.education || analysis.resumeContent.education.length === 0) && (
                <p className="text-sm text-muted-foreground">No education information found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="text-primary mr-2 h-5 w-5" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2" data-testid="technical-skills">
              {analysis.skills?.technical?.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {(!analysis.skills?.technical || analysis.skills.technical.length === 0) && (
                <p className="text-sm text-muted-foreground">No technical skills found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="text-primary mr-2 h-5 w-5" />
              Soft Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2" data-testid="soft-skills">
              {analysis.skills?.soft?.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-sm text-muted-foreground">{skill}</span>
                </div>
              ))}
              {(!analysis.skills?.soft || analysis.skills.soft.length === 0) && (
                <p className="text-sm text-muted-foreground col-span-2">No soft skills found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects & Certifications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Projects */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="text-primary mr-2 h-5 w-5" />
              Notable Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" data-testid="projects">
              {analysis.resumeContent?.projects?.map((project, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-md">
                  <h4 className="font-medium text-foreground">{project.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!analysis.resumeContent?.projects || analysis.resumeContent.projects.length === 0) && (
                <p className="text-sm text-muted-foreground">No projects found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="text-primary mr-2 h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" data-testid="certifications">
              {analysis.resumeContent?.certifications?.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div>
                    <h4 className="font-medium text-foreground">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                  </div>
                  <Award className="text-accent h-5 w-5" />
                </div>
              ))}
              {(!analysis.resumeContent?.certifications || analysis.resumeContent.certifications.length === 0) && (
                <p className="text-sm text-muted-foreground">No certifications found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
