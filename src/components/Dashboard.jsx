// src/components/Dashboard.js
import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import { mockJobs } from "../mock/mockUsers";
import { createSubmission, listSubmissions, listArchivedSubmissions, getBalances } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const jobs = mockJobs;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ctvId = useMemo(() => (user?.email || user?.id || "CTV"), [user]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [archived, setArchived] = useState([]);
  const [balances, setBalances] = useState(getBalances());

  const refresh = async () => {
    const [subs, arch] = await Promise.all([listSubmissions(), listArchivedSubmissions()]);
    setCandidates(subs
      .filter((s) => s.ctv === ctvId)
      .map((s) => ({ id: s.id, name: s.candidate, job: s.job, status: s.status, bonus: s.bonus || "-" })));
    setArchived(arch.filter((s) => s.ctv === ctvId));
    setBalances(getBalances());
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctvId]);

  const closeModal = () => setSelectedJob(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form[0].value;
    const email = form[1].value; // reserved for future use
    const cvFile = form[2].files?.[0] || null;
    const linkedin = form[3].value;

    const newSub = await createSubmission({
      candidateName: name,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      ctvId,
      linkedin,
      cvName: cvFile?.name,
      bonus: selectedJob.bonus,
    });

    await refresh();
    form.reset();
    closeModal();
    alert("Gửi hồ sơ thành công!");
  };

  const ctvBonus = useMemo(() => balances.ctvBonusById?.[ctvId] || 0, [balances, ctvId]);

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard CTV</h2>
        <div className="stat-pill">Bonus của bạn: ${ctvBonus}</div>
      </div>

      <div className="dashboard-grid">
        {/* Cột trái: danh sách job */}
        <div className="job-board-card">
          <h2>Danh sách Job</h2>
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/job/${job.id}`)} style={{ cursor: 'pointer' }}>
                <h3>{job.title}</h3>
                <p>
                  <strong>Công ty:</strong> {job.company}
                </p>
                <p>
                  <strong>Địa điểm:</strong> {job.location}
                </p>
                {job.deadline && <p><strong>Hạn nộp:</strong> {job.deadline}</p>}
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  Vacancies: {job.vacancies} · Applicants: {job.applicants} · Online {job.onlineDaysAgo} days ago
                </p>
                <div className="reward-line">
                  <span className="reward-badge">USD {job.rewardCandidateUSD} /Candidate</span>
                  <span className="reward-badge secondary">+USD {job.rewardInterviewUSD} /Interview</span>
                </div>
                {Array.isArray(job.keywords) && job.keywords.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "6px 0 8px" }}>
                    {job.keywords.map((kw) => (
                      <span
                        key={kw}
                        style={{
                          background: "#eef2ff",
                          color: "#3730a3",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "12px",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                <p className="bonus">💰 Bonus: {job.bonus}</p>
                <button onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}>Giới thiệu ứng viên</button>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: bảng theo dõi ứng viên */}
        <div className="candidate-tracker">
          <h2>Theo dõi ứng viên</h2>
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Job</th>
                <th>Trạng thái</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.job}</td>
                  <td>{c.status}</td>
                  <td>{c.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 16 }}>Đã hoàn tất (Hired/Rejected)</h3>
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Job</th>
                <th>Trạng thái</th>
                <th>Bonus</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {archived.map((c) => (
                <tr key={c.id}>
                  <td>{c.candidate}</td>
                  <td>{c.job}</td>
                  <td>{c.status}</td>
                  <td>{c.bonus || '-'} </td>
                  <td>{new Date(c.finalizedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nộp ứng viên */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Giới thiệu ứng viên cho {selectedJob.title}</h3>
            <form onSubmit={handleSubmit} className="candidate-form">
              <input type="text" placeholder="Tên ứng viên" required />
              <input type="email" placeholder="Email" required />
              <input type="file" accept=".pdf" required />
              <input type="url" placeholder="Link LinkedIn" />
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel">Hủy</button>
                <button type="submit" className="submit">Gửi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
