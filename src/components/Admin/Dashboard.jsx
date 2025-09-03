// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { fetchJobs, listSubmissions, listArchivedSubmissions, updateSubmissionStatus, getBalances, finalizeSubmission } from "../../api";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["Submitted", "Interviewing", "Offer", "Hired", "Rejected"];

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [archived, setArchived] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [balances, setBalancesState] = useState(getBalances());
  const navigate = useNavigate();

  const refresh = async () => {
    const [subs, arch] = await Promise.all([listSubmissions(), listArchivedSubmissions()]);
    setSubmissions(subs);
    setArchived(arch);
    setBalancesState(getBalances());
  };

  useEffect(() => {
    refresh();
    fetchJobs().then(setJobs);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateSubmissionStatus({ id, status: newStatus });
    await refresh();
  };

  const handleBonusChange = async (id, newBonus) => {
    await updateSubmissionStatus({ id, bonus: newBonus });
    await refresh();
  };

  const handleSave = async (sub) => {
    if (sub.status === "Hired" || sub.status === "Rejected") {
      await finalizeSubmission({ id: sub.id });
      await refresh();
      alert(`Đã lưu và hoàn tất hồ sơ ${sub.candidate}`);
    } else {
      alert(`Đã lưu cập nhật hồ sơ ${sub.candidate}`);
    }
  };

  return (
    <div className="admin-dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2>Quản lý ứng viên</h2>
        <div className="stat-pill">Admin Credit: ${balances.adminCredit}</div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ứng viên</th>
            <th>Job</th>
            <th>CTV</th>
            <th>CV</th>
            <th>LinkedIn</th>
            <th>Trạng thái</th>
            <th>Bonus</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.candidate}</td>
              <td>{sub.job}</td>
              <td>{sub.ctv}</td>
              <td>
                {sub.cv ? (
                  <a href={'#'} onClick={(e) => { e.preventDefault(); alert(`Tải CV: ${sub.cv}`); }}> {sub.cv} </a>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td>
                {sub.linkedin ? (
                  <a href={sub.linkedin} target="_blank" rel="noreferrer">Link</a>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td>
                <select value={sub.status} onChange={(e) => handleStatusChange(sub.id, e.target.value)}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input type="text" value={sub.bonus || "-"} onChange={(e) => handleBonusChange(sub.id, e.target.value)} />
              </td>
              <td>
                <button onClick={() => handleSave(sub)}>Cập nhật</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Đã hoàn tất (Hired/Rejected)</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ứng viên</th>
            <th>Job</th>
            <th>CTV</th>
            <th>Trạng thái</th>
            <th>Bonus</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {archived.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.candidate}</td>
              <td>{sub.job}</td>
              <td>{sub.ctv}</td>
              <td>{sub.status}</td>
              <td>{sub.bonus || '-'} </td>
              <td>{new Date(sub.finalizedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="jobs-header" style={{ marginTop: 24 }}>
        <h3>Jobs đang mở</h3>
        <span className="jobs-count">{jobs.length} jobs</span>
      </div>
      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card" onClick={() => navigate(`/job/${job.id}`)} style={{ cursor: 'pointer' }}>
            <div className="job-title">{job.title}</div>
            <div style={{ fontSize: "13px", color: "#555", marginBottom: "6px" }}>
              <strong>Công ty:</strong> {job.company}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
              <span>Vacancies: {job.vacancies}</span>
              <span style={{ marginLeft: 8 }}>Applicants: {job.applicants}</span>
              <span style={{ marginLeft: 8 }}>Online {job.onlineDaysAgo} days ago</span>
            </div>
            <div className="job-meta">
              <span className="job-location">{job.location}</span>
              {job.bonus && <span className="job-bonus">Bonus: {job.bonus}</span>}
              {job.deadline && <span className="job-deadline">Hạn nộp: {job.deadline}</span>}
            </div>
            <div className="reward-line">
              <span className="reward-badge">USD {job.rewardCandidateUSD} /Candidate</span>
              <span className="reward-badge secondary">+USD {job.rewardInterviewUSD} /Interview</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
