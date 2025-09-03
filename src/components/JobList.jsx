// src/components/JobList.js
import React, { useEffect, useState } from "react";
import { Link } from "../router";
import { fetchJobs } from "../api";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then(setJobs);
  }, []);

  return (
    <div>
      <h2>Job List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <Link to={`/job/${job.id}`}>
              {job.title} – {job.location}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
