// src/mock/mockUsers.js
// Users
export const mockUsers = [
  { id: 1, email: "ctv1@example.com", password: "123456", role: "CTV", name: "Nguyễn Văn A", bonusTotal: "$1,250" },
  { id: 2, email: "ctv2@example.com", password: "123456", role: "CTV", name: "Trần Thị B", bonusTotal: "$980" },
  { id: 3, email: "admin@example.com", password: "admin123", role: "admin", name: "Admin", credit: "$5,000" }
];

// Jobs (opened)
export const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", location: "Hà Nội", bonus: "500 USD", deadline: "2025-10-15", keywords: ["React", "JavaScript", "UI"], vacancies: 1, applicants: 4, onlineDaysAgo: 3, rewardCandidateUSD: 694, rewardInterviewUSD: 2, status: "Active" },
  { id: 2, title: "Backend Engineer", company: "InnovateX", location: "TP. HCM", bonus: "800 USD", deadline: "2025-10-20", keywords: ["Node.js", "API", "MongoDB"], vacancies: 2, applicants: 1, onlineDaysAgo: 3, rewardCandidateUSD: 800, rewardInterviewUSD: 3, status: "Active" },
  { id: 3, title: "Data Scientist", company: "AI Solutions", location: "Remote", bonus: "1000 USD", deadline: "2025-10-25", keywords: ["Python", "ML", "Pandas"], vacancies: 1, applicants: 0, onlineDaysAgo: 3, rewardCandidateUSD: 1000, rewardInterviewUSD: 2, status: "Active" },
  { id: 4, title: "UI/UX Designer", company: "CreativeHub", location: "Đà Nẵng", bonus: "400 USD", deadline: "2025-10-30", keywords: ["Figma", "UX", "Prototype"], vacancies: 1, applicants: 2, onlineDaysAgo: 2, rewardCandidateUSD: 400, rewardInterviewUSD: 1, status: "Active" },
  { id: 5, title: "Mobile Developer (React Native)", company: "AppWorks", location: "Hà Nội", bonus: "600 USD", deadline: "2025-11-01", keywords: ["React Native", "iOS", "Android"], vacancies: 1, applicants: 3, onlineDaysAgo: 1, rewardCandidateUSD: 600, rewardInterviewUSD: 2, status: "Active" },
  { id: 6, title: "DevOps Engineer", company: "CloudOps", location: "Remote", bonus: "900 USD", deadline: "2025-11-05", keywords: ["AWS", "CI/CD", "Docker"], vacancies: 1, applicants: 1, onlineDaysAgo: 4, rewardCandidateUSD: 900, rewardInterviewUSD: 2, status: "Active" },
  { id: 7, title: "Project Manager", company: "PM Solutions", location: "TP. HCM", bonus: "700 USD", deadline: "2025-11-10", keywords: ["Agile", "Scrum", "Leadership"], vacancies: 1, applicants: 2, onlineDaysAgo: 2, rewardCandidateUSD: 700, rewardInterviewUSD: 2, status: "Active" },
  { id: 8, title: "QA Engineer", company: "TestLab", location: "Đà Nẵng", bonus: "500 USD", deadline: "2025-11-12", keywords: ["Testing", "Automation", "Selenium"], vacancies: 1, applicants: 1, onlineDaysAgo: 5, rewardCandidateUSD: 500, rewardInterviewUSD: 1, status: "Active" },
  { id: 9, title: "System Analyst", company: "BizTech", location: "Hà Nội", bonus: "750 USD", deadline: "2025-11-15", keywords: ["Requirements", "UML", "SQL"], vacancies: 1, applicants: 0, onlineDaysAgo: 3, rewardCandidateUSD: 750, rewardInterviewUSD: 2, status: "Active" },
  { id: 10, title: "Security Specialist", company: "CyberSafe", location: "Remote", bonus: "1000 USD", deadline: "2025-11-18", keywords: ["Security", "Pentest", "OWASP"], vacancies: 1, applicants: 1, onlineDaysAgo: 2, rewardCandidateUSD: 1000, rewardInterviewUSD: 2, status: "Active" },
  { id: 11, title: "AI Engineer", company: "DeepMind VN", location: "TP. HCM", bonus: "1200 USD", deadline: "2025-11-20", keywords: ["Deep Learning", "PyTorch", "NLP"], vacancies: 1, applicants: 2, onlineDaysAgo: 3, rewardCandidateUSD: 1200, rewardInterviewUSD: 3, status: "Active" },
  { id: 12, title: "Blockchain Developer", company: "CryptoLabs", location: "Remote", bonus: "1500 USD", deadline: "2025-11-25", keywords: ["Solidity", "Web3", "Smart Contract"], vacancies: 1, applicants: 0, onlineDaysAgo: 1, rewardCandidateUSD: 1500, rewardInterviewUSD: 3, status: "Active" },
  { id: 13, title: "Product Owner", company: "AgileWorks", location: "Hà Nội", bonus: "800 USD", deadline: "2025-11-28", keywords: ["Backlog", "Roadmap", "Stakeholder"], vacancies: 1, applicants: 1, onlineDaysAgo: 2, rewardCandidateUSD: 800, rewardInterviewUSD: 2, status: "Active" },
  { id: 14, title: "Customer Success Manager", company: "ServicePro", location: "Đà Nẵng", bonus: "600 USD", deadline: "2025-12-01", keywords: ["Support", "Retention", "B2B"], vacancies: 1, applicants: 1, onlineDaysAgo: 2, rewardCandidateUSD: 600, rewardInterviewUSD: 1, status: "Active" },
  { id: 15, title: "Tech Lead", company: "ScaleUp", location: "TP. HCM", bonus: "1300 USD", deadline: "2025-12-05", keywords: ["Leadership", "Architecture", "Code Review"], vacancies: 1, applicants: 2, onlineDaysAgo: 4, rewardCandidateUSD: 1300, rewardInterviewUSD: 3, status: "Active" },
  { id: 16, title: "Database Administrator", company: "DataCare", location: "Hà Nội", bonus: "700 USD", deadline: "2025-12-08", keywords: ["PostgreSQL", "Backup", "Performance"], vacancies: 1, applicants: 0, onlineDaysAgo: 3, rewardCandidateUSD: 700, rewardInterviewUSD: 2, status: "Active" },
  { id: 17, title: "Content Strategist", company: "MediaWorks", location: "Remote", bonus: "450 USD", deadline: "2025-12-10", keywords: ["Content", "SEO", "Analytics"], vacancies: 1, applicants: 1, onlineDaysAgo: 3, rewardCandidateUSD: 450, rewardInterviewUSD: 1, status: "Active" },
  { id: 18, title: "Machine Learning Engineer", company: "SmartAI", location: "Hà Nội", bonus: "1100 USD", deadline: "2025-12-12", keywords: ["ML", "MLOps", "TensorFlow"], vacancies: 1, applicants: 2, onlineDaysAgo: 2, rewardCandidateUSD: 1100, rewardInterviewUSD: 2, status: "Active" },
  { id: 19, title: "Fullstack Developer", company: "DevStudio", location: "TP. HCM", bonus: "950 USD", deadline: "2025-12-15", keywords: ["React", "Node.js", "SQL"], vacancies: 1, applicants: 3, onlineDaysAgo: 3, rewardCandidateUSD: 950, rewardInterviewUSD: 2, status: "Active" },
  { id: 20, title: "Cloud Architect", company: "SkyNet", location: "Remote", bonus: "1400 USD", deadline: "2025-12-20", keywords: ["Cloud", "Kubernetes", "Design"], vacancies: 1, applicants: 0, onlineDaysAgo: 1, rewardCandidateUSD: 1400, rewardInterviewUSD: 3, status: "Active" }
];

// CTV dashboard – candidate tracker
export const mockCtvCandidates = [
  { id: 1, name: "Nguyễn Văn A", job: "Frontend Developer", status: "Submitted", bonus: "500 USD" },
  { id: 2, name: "Trần Thị B", job: "Data Scientist", status: "Interviewing", bonus: "1000 USD" },
  { id: 3, name: "Lê Văn C", job: "DevOps Engineer", status: "Rejected", bonus: "0 USD" },
  { id: 4, name: "Phạm Thu D", job: "QA Engineer", status: "Submitted", bonus: "500 USD" },
  { id: 5, name: "Đỗ Minh E", job: "Backend Engineer", status: "Offer", bonus: "800 USD" }
];

// Admin dashboard – CTV submissions overview
export const mockAdminSubmissions = [
  { id: 1, candidate: "Nguyễn Văn A", job: "Frontend Developer", ctv: "CTV1", status: "Submitted", bonus: "500 USD", cv: "NguyenVanA_CV.pdf", linkedin: "https://www.linkedin.com/in/nguyenvana" },
  { id: 2, candidate: "Trần Thị B", job: "Data Scientist", ctv: "CTV2", status: "Interviewing", bonus: "1000 USD", cv: "TranThiB_CV.pdf", linkedin: "https://www.linkedin.com/in/tranthib" },
  { id: 3, candidate: "Lê Văn C", job: "DevOps Engineer", ctv: "CTV1", status: "Rejected", bonus: "0 USD", cv: "LeVanC_CV.pdf", linkedin: "https://www.linkedin.com/in/levanc" },
  { id: 4, candidate: "Phạm Thu D", job: "QA Engineer", ctv: "CTV3", status: "Submitted", bonus: "500 USD", cv: "PhamThuD_CV.pdf", linkedin: "https://www.linkedin.com/in/phamthud" },
  { id: 5, candidate: "Đỗ Minh E", job: "Backend Engineer", ctv: "CTV2", status: "Offer", bonus: "800 USD", cv: "DoMinhE_CV.pdf", linkedin: "https://www.linkedin.com/in/dominhe" }
];

// Notifications
// role: 'admin' | 'CTV' | 'all'
export const mockNotifications = [
  { id: "n1", role: "admin", message: "CTV1 vừa cập nhật hồ sơ Nguyễn Văn A", createdAt: Date.now() - 5 * 60 * 1000 },
  { id: "n2", role: "CTV", message: "Job Backend Engineer đã mở lại", createdAt: Date.now() - 30 * 60 * 1000 },
  { id: "n3", role: "all", message: "Hệ thống bảo trì lúc 23:00 hôm nay", createdAt: Date.now() - 2 * 60 * 60 * 1000 },
];
  