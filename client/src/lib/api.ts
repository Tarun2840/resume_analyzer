export const API_BASE_URL = "";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to analyze resume");
  }

  return response.json();
}

export async function getResumeAnalyses() {
  const response = await fetch(`${API_BASE_URL}/api/resume-analyses`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch resume analyses");
  }

  return response.json();
}

export async function getResumeAnalysis(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/resume-analyses/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch resume analysis");
  }

  return response.json();
}
