import React from "react";
import { useAuth } from "../../context/AuthContext";
import { getBalances } from "../../api";

export default function ViewProfile() {
  const { user } = useAuth();
  const balances = getBalances();
  const ctvId = user?.email || user?.id || "CTV";
  const bonus = user?.role === "CTV" ? (balances.ctvBonusById?.[ctvId] || 0) : undefined;

  if (!user) return null;

  return (
    <div style={{ padding: 16 }}>
      <h2>Profile</h2>
      <div><strong>Name:</strong> {user.name || "-"}</div>
      <div><strong>Email:</strong> {user.email || "-"}</div>
      <div><strong>Role:</strong> {user.role}</div>
      {user.role === "admin" && (
        <div><strong>Admin Credit:</strong> ${balances.adminCredit}</div>
      )}
      {user.role === "CTV" && (
        <div><strong>Bonus:</strong> ${bonus}</div>
      )}
    </div>
  );
}
