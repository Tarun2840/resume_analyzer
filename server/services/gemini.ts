import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface ResumeAnalysisResult {
  personalDetails: {
    name?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
    portfolio?: string;
  };
  resumeContent: {
    summary?: string;
    workExperience?: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      duration: string;
      details?: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies?: string[];
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  aiFeedback: {
    rating: number;
    improvementAreas: string[];
    suggestedSkills: string[];
    summary: string;
  };
}

export async function analyzeResumeWithAI(resumeText: string): Promise<ResumeAnalysisResult> {
  try {
    const systemPrompt = `You are an expert resume analyzer and career advisor. Analyze the provided resume text and extract structured information.

Return a JSON object with the following structure:
{
  "personalDetails": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "linkedIn": "string",
    "portfolio": "string"
  },
  "resumeContent": {
    "summary": "string",
    "workExperience": [
      {
        "title": "string",
        "company": "string", 
        "duration": "string",
        "description": "string"
      }
    ],
    "education": [
      {
        "degree": "string",
        "institution": "string",
        "duration": "string", 
        "details": "string"
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string"]
      }
    ],
    "certifications": [
      {
        "name": "string",
        "issuer": "string",
        "date": "string"
      }
    ]
  },
  "skills": {
    "technical": ["string"],
    "soft": ["string"]
  },
  "aiFeedback": {
    "rating": number (1-10),
    "improvementAreas": ["string"],
    "suggestedSkills": ["string"],
    "summary": "string"
  }
}

Provide specific, actionable feedback in the improvementAreas and suggest relevant skills for career advancement.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            personalDetails: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                linkedIn: { type: "string" },
                portfolio: { type: "string" }
              }
            },
            resumeContent: {
              type: "object",
              properties: {
                summary: { type: "string" },
                workExperience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      company: { type: "string" },
                      duration: { type: "string" },
                      description: { type: "string" }
                    },
                    required: ["title", "company", "duration", "description"]
                  }
                },
                education: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      degree: { type: "string" },
                      institution: { type: "string" },
                      duration: { type: "string" },
                      details: { type: "string" }
                    },
                    required: ["degree", "institution", "duration"]
                  }
                },
                projects: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      technologies: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["name", "description"]
                  }
                },
                certifications: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      issuer: { type: "string" },
                      date: { type: "string" }
                    },
                    required: ["name", "issuer", "date"]
                  }
                }
              }
            },
            skills: {
              type: "object",
              properties: {
                technical: {
                  type: "array",
                  items: { type: "string" }
                },
                soft: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["technical", "soft"]
            },
            aiFeedback: {
              type: "object",
              properties: {
                rating: { type: "number", minimum: 1, maximum: 10 },
                improvementAreas: {
                  type: "array",
                  items: { type: "string" }
                },
                suggestedSkills: {
                  type: "array",
                  items: { type: "string" }
                },
                summary: { type: "string" }
              },
              required: ["rating", "improvementAreas", "suggestedSkills", "summary"]
            }
          },
          required: ["personalDetails", "resumeContent", "skills", "aiFeedback"]
        }
      },
      contents: resumeText,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const analysisResult: ResumeAnalysisResult = JSON.parse(rawJson);
    return analysisResult;
  } catch (error) {
    throw new Error(`Failed to analyze resume with AI: ${error}`);
  }
}
