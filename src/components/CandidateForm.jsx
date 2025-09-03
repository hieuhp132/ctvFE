// src/components/CandidateForm.js
import React, { useState } from "react";
import { submitCandidate } from "../api";

export default function CandidateForm() {
  const [name, setName] = useState("");
  const [jobId, setJobId] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [cv, setCv] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await submitCandidate({ name, jobId, linkedin, cv });
    alert("Candidate submitted: " + JSON.stringify(res));
  };

  return (
    <form onSubmit={submit}>
      <h2>Submit Candidate</h2>
      <input placeholder="Candidate Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Job ID" value={jobId} onChange={e=>setJobId(e.target.value)} />
      <input placeholder="LinkedIn URL" value={linkedin} onChange={e=>setLinkedin(e.target.value)} />
      <input type="file" onChange={e=>setCv(e.target.files[0])} />
      <button type="submit">Submit</button>
    </form>
  );
}
