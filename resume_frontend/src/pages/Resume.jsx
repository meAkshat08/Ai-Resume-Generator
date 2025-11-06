import { useEffect, useState } from "react";
import { getUserResumes } from "../api/ResumeService";

function Resume() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const data = await getUserResumes();   // calls GET /api/v1/resume/list with your JWT
        setResumes(data);                      // store list in state → triggers re-render
      } catch (err) {
        console.log("Error fetching resumes:", err);
      }
    };
    loadResumes();
  }, []); // [] = run once when page loads

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Your Generated Resumes</h1>

      {resumes.length === 0 ? (
        <p style={{ fontSize: "18px", opacity: 0.7 }}>
          No resumes generated yet.
        </p>
      ) : (
        resumes.map((resume, index) => (
          <div
            key={index}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              whiteSpace: "pre-wrap",   // keep newlines from the text
              lineHeight: "1.5",
              fontSize: "16px",
            }}
          >
            {/* try common field names; fall back to raw object if structure is different */}
            {resume.resumeText || resume.resumeContent || resume.text || JSON.stringify(resume, null, 2)}
          </div>
        ))
      )}
    </div>
  );
}

export default Resume;
