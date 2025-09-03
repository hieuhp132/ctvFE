import React, { useEffect, useMemo, useState } from "react";
import { listSubmissions, listArchivedSubmissions } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function MyCandidates() {
  const { user } = useAuth();
  const ctvId = useMemo(() => (user?.email || user?.id || "CTV"), [user]);
  const [active, setActive] = useState([]);
  const [archived, setArchived] = useState([]);

  useEffect(() => {
    Promise.all([listSubmissions(), listArchivedSubmissions()]).then(([subs, arch]) => {
      setActive(subs.filter((s) => s.ctv === ctvId));
      setArchived(arch.filter((s) => s.ctv === ctvId));
    });
  }, [ctvId]);

  return (
    <div style={{ padding: 16 }}>
      <h2>My Candidates</h2>

      <h3>Đang xử lý</h3>
      <table>
        <thead>
          <tr>
            <th>Ứng viên</th>
            <th>Job</th>
            <th>Trạng thái</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          {active.map((s) => (
            <tr key={s.id}>
              <td>{s.candidate}</td>
              <td>{s.job}</td>
              <td>{s.status}</td>
              <td>{s.bonus || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Đã hoàn tất</h3>
      <table>
        <thead>
          <tr>
            <th>Ứng viên</th>
            <th>Job</th>
            <th>Trạng thái</th>
            <th>Bonus</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {archived.map((s) => (
            <tr key={s.id}>
              <td>{s.candidate}</td>
              <td>{s.job}</td>
              <td>{s.status}</td>
              <td>{s.bonus || '-'}</td>
              <td>{new Date(s.finalizedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
