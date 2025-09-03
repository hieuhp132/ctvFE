// src/api.js
import { mockJobs } from "./mock/mockUsers";

const LS_SUBMISSIONS = "submissions"; // active
const LS_ARCHIVED = "submissionsArchived"; // finalized (Hired/Rejected)
const LS_NOTIFICATIONS = "notifications";
const LS_BALANCES = "balances"; // { adminCredit: number, ctvBonusById: { [id:string]: number } }

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeKey(key) {
  try { localStorage.removeItem(key); } catch {}
}

function nowId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function parseAmount(input) {
  if (input == null) return 0;
  if (typeof input === "number") return input;
  const num = String(input).replace(/[^0-9.-]/g, "");
  const n = parseFloat(num);
  return Number.isFinite(n) ? n : 0;
}

// Balances API
export function getBalances() {
  const def = { adminCredit: 5000, ctvBonusById: {} };
  const b = readJson(LS_BALANCES, def);
  if (typeof b.adminCredit !== "number") b.adminCredit = parseAmount(b.adminCredit);
  if (!b.ctvBonusById || typeof b.ctvBonusById !== "object") b.ctvBonusById = {};
  return b;
}

export function setBalances(next) { writeJson(LS_BALANCES, next); }

export function resetDemoData() {
  removeKey(LS_SUBMISSIONS);
  removeKey(LS_ARCHIVED);
  removeKey(LS_NOTIFICATIONS);
  writeJson(LS_BALANCES, { adminCredit: 5000, ctvBonusById: {} });
}

function addBonusForCTV(ctvId, amount) {
  if (!ctvId || !amount) return;
  const bal = getBalances();
  bal.ctvBonusById[ctvId] = parseAmount(bal.ctvBonusById[ctvId]) + parseAmount(amount);
  bal.adminCredit = parseAmount(bal.adminCredit) - parseAmount(amount);
  setBalances(bal);
}

// Jobs
export async function fetchJobs() {
  return mockJobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    bonus: j.bonus,
    deadline: j.deadline,
    keywords: j.keywords,
    vacancies: j.vacancies,
    applicants: j.applicants,
    onlineDaysAgo: j.onlineDaysAgo,
    rewardCandidateUSD: j.rewardCandidateUSD,
    rewardInterviewUSD: j.rewardInterviewUSD,
    status: j.status,
  }));
}

export async function fetchJob(id) {
  const jobs = await fetchJobs();
  return jobs.find((j) => String(j.id) === String(id)) || null;
}

// Auth mocks
export async function login(email, password) { return { token: "fake-token", user: { email } }; }
export async function signup(email, password) { return { token: "fake-token", user: { email } }; }

// Submissions API (CTV -> Admin)
export async function listSubmissions() { return readJson(LS_SUBMISSIONS, []); }
export async function listArchivedSubmissions() { return readJson(LS_ARCHIVED, []); }

export async function createSubmission({ candidateName, jobId, jobTitle, ctvId, linkedin, cvName, bonus }) {
  const submissions = readJson(LS_SUBMISSIONS, []);
  const newItem = {
    id: nowId("sub"), candidate: candidateName, jobId, job: jobTitle, ctv: ctvId || "CTV",
    status: "Submitted", bonus: bonus ?? "-", cv: cvName || null, linkedin: linkedin || null, createdAt: Date.now(),
  };
  submissions.push(newItem);
  writeJson(LS_SUBMISSIONS, submissions);
  await pushNotification({ role: "admin", message: `${newItem.ctv} vừa giới thiệu ứng viên ${newItem.candidate}` });
  await pushNotification({ role: "CTV", message: `Đã gửi hồ sơ ${newItem.candidate} cho job ${newItem.job}` });
  return newItem;
}

export async function updateSubmissionStatus({ id, status, bonus }) {
  const active = readJson(LS_SUBMISSIONS, []);
  const idx = active.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const before = active[idx];
  const updated = { ...before, status: status ?? before.status, bonus: bonus ?? before.bonus };
  active[idx] = updated;
  writeJson(LS_SUBMISSIONS, active);
  await pushNotification({ role: "CTV", message: `Hồ sơ ${updated.candidate} cập nhật trạng thái: ${updated.status}` });
  return updated;
}

export async function finalizeSubmission({ id }) {
  const active = readJson(LS_SUBMISSIONS, []);
  const idx = active.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const item = active[idx];
  const status = item.status;
  const finalStatuses = ["Hired", "Rejected"];
  if (!finalStatuses.includes(status)) return null;
  const archived = readJson(LS_ARCHIVED, []);
  const finalized = { ...item, finalizedAt: Date.now() };
  archived.unshift(finalized);
  writeJson(LS_ARCHIVED, archived);
  active.splice(idx, 1);
  writeJson(LS_SUBMISSIONS, active);
  if (status === "Hired") {
    const amount = parseAmount(item.bonus);
    addBonusForCTV(item.ctv, amount);
    await pushNotification({ role: "CTV", message: `Hồ sơ ${item.candidate} đã Hired. Bonus: ${amount}` });
    await pushNotification({ role: "admin", message: `Đã thanh toán bonus ${amount} cho ${item.ctv}` });
  } else {
    await pushNotification({ role: "CTV", message: `Hồ sơ ${item.candidate} đã Rejected` });
  }
  return finalized;
}

// Notifications API
export async function listNotifications() { return readJson(LS_NOTIFICATIONS, []); }
export async function pushNotification({ role = "all", message }) {
  const items = readJson(LS_NOTIFICATIONS, []);
  const item = { id: nowId("n"), role, message, createdAt: Date.now() };
  items.push(item);
  writeJson(LS_NOTIFICATIONS, items);
  return item;
}

// Legacy placeholders for compatibility
export async function fetchCandidates() {
  const subs = await listSubmissions();
  return subs.map((s) => ({ id: s.id, name: s.candidate, jobTitle: s.job, status: s.status, bonus: s.bonus || "-" }));
}

export async function submitCandidate({ name, jobId, linkedin, cv, ctvId, bonus }) {
  const job = await fetchJob(jobId);
  const jobTitle = job?.title || String(jobId);
  const amount = bonus ?? parseAmount(job?.bonus);
  return createSubmission({ candidateName: name, jobId, jobTitle, ctvId, linkedin, cvName: cv?.name, bonus: amount });
}
  