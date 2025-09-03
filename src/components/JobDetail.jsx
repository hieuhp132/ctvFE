// src/components/JobDetail.js
import React, { useEffect, useMemo, useState } from "react";
import { fetchJob, createSubmission, listSubmissions, listArchivedSubmissions } from "../api";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isCTV = user?.role === "CTV";
  const isAdmin = user?.role === "admin";
  const ctvId = useMemo(() => (user?.email || user?.id || "CTV"), [user]);

  const [job, setJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [groupedOffers, setGroupedOffers] = useState({});

  useEffect(() => {
    fetchJob(id).then((j) =>
      setJob(
        j || {
          id,
          title: "Job Title",
          location: "Vietnam",
          bonus: "USD 500",
          description: "",
        }
      )
    );
  }, [id]);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([listSubmissions(), listArchivedSubmissions()]).then(([subs, arch]) => {
      const all = [...subs, ...arch].filter((s) => String(s.jobId) === String(id));
      const grouped = all.reduce((acc, s) => {
        const key = s.ctv || "CTV";
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
      }, {});
      setGroupedOffers(grouped);
    });
  }, [id, isAdmin]);

  if (!job) return <p>Loading...</p>;

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form[0].value;
    const email = form[1].value; // reserved for future use
    const cvFile = form[2].files?.[0] || null;
    const linkedin = form[3].value;
    await createSubmission({ candidateName: name, jobId: id, jobTitle: job.title, ctvId, linkedin, cvName: cvFile?.name, bonus: job.bonus });
    alert("Gửi hồ sơ thành công!");
    setOpen(false);
    form.reset();
  };

  const section = (title, children) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ lineHeight: 1.6, color: "#222" }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{job.title}</div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <span style={{ background: "#eef2ff", color: "#3730a3", padding: "3px 10px", borderRadius: 999, fontSize: 12 }}>Operation Management</span>
        <span style={{ background: "#eef2ff", color: "#3730a3", padding: "3px 10px", borderRadius: 999, fontSize: 12 }}>Leadership</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Left: details */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
            <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 12, color: "#666" }}>Salary</div>
              <div style={{ fontWeight: 600 }}>Up to {typeof job.bonus === 'string' ? job.bonus : `USD ${job.rewardCandidateUSD || 500}`}</div>
            </div>
            <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 12, color: "#666" }}>Location</div>
              <div style={{ fontWeight: 600 }}>{job.location || "Vietnam"}</div>
            </div>
            <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 12, color: "#666" }}>Reward</div>
              <div style={{ fontWeight: 600 }}>Candidate: USD {job.rewardCandidateUSD || 500}</div>
            </div>
          </div>

          {section(
            "Job Overview And Responsibility",
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>Design and implement core operational processes for company scalability.</li>
              <li>Build and run customer support operations and documentation.</li>
              <li>Collaborate across product, engineering, and leadership teams.</li>
              <li>Monitor business metrics and ensure compliance.</li>
              <li>Recruit, train, and lead the Customer Support team.</li>
              <li>Identify operational bottlenecks and propose scalable solutions.</li>
            </ul>
          )}

          {section(
            "Required Skills and Experience",
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>4-5 years of experience in operations/business/customer support.</li>
              <li>Experience setting up processes and scaling teams.</li>
              <li>Strong writing and documentation skills.</li>
              <li>Proficiency in productivity tools (Google Workspace, Notion).</li>
              <li>Comfortable with ambiguity and rapid change.</li>
              <li>English reading/writing proficiency.</li>
            </ul>
          )}

          {section(
            "Why Candidate should apply this position",
            <>
              <div>Salary range: up to USD {job.rewardCandidateUSD || 500}/month</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                <li>Growth mindset and ownership culture.</li>
                <li>Healthy debates and transparent communication.</li>
                <li>Document everything for clarity and speed.</li>
                <li>Startup environment with bold vision and rapid learning.</li>
              </ul>
            </>
          )}

          {section(
            "Preferred skills and experiences",
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>Experience in crypto/blockchain industry is a plus.</li>
              <li>Track record of managing cross-functional teams.</li>
              <li>Experience with compliance and regulatory processes.</li>
            </ul>
          )}

          {section(
            "Interview process",
            <>
              <div>1. Interview with co-founder → home assignment</div>
              <div>2. Panel interview → offer</div>
            </>
          )}

          {/* Admin view: grouped offers by CTV */}
          {isAdmin && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>CTV offers</div>
              {Object.keys(groupedOffers).length === 0 ? (
                <div style={{ color: "#666" }}>Job chưa có offer.</div>
              ) : (
                Object.entries(groupedOffers).map(([ctv, items]) => (
                  <div key={ctv} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{ctv}</div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "6px 4px" }}>Ứng viên</th>
                          <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "6px 4px" }}>Trạng thái</th>
                          <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "6px 4px" }}>Bonus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((s) => (
                          <tr key={s.id}>
                            <td style={{ padding: "6px 4px" }}>{s.candidate}</td>
                            <td style={{ padding: "6px 4px" }}>{s.status}</td>
                            <td style={{ padding: "6px 4px" }}>{s.bonus || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: actions for CTV */}
        <aside style={{ alignSelf: "start" }}>
          {isCTV && (
            <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 14, background: "#fff" }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Thao tác</div>
              <button onClick={() => setOpen(true)} style={{ width: "100%" }}>Giới thiệu ứng viên</button>
            </div>
          )}
        </aside>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Giới thiệu ứng viên cho {job.title}</h3>
            <form onSubmit={submit} className="candidate-form">
              <input type="text" placeholder="Tên ứng viên" required />
              <input type="email" placeholder="Email" required />
              <input type="file" accept=".pdf" required />
              <input type="url" placeholder="Link LinkedIn" />
              <div className="modal-actions">
                <button type="button" onClick={() => setOpen(false)} className="cancel">Hủy</button>
                <button type="submit" className="submit">Gửi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
