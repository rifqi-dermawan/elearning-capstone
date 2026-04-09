// Static seed/fallback data — not used in production API routes

interface Modul {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface UserLog {
  userId: string;
  modulId: string;
  action: string;
  rating: number;
}

export const daftarModul: Modul[] = [
  { id: "m1", title: "Dasar HTML & CSS", description: "Belajar struktur web", tags: ["Web", "Frontend"] },
  { id: "m2", title: "Javascript Modern", description: "Logic di frontend", tags: ["Web", "Javascript"] },
  { id: "m3", title: "Pengenalan Database", description: "Simpan data dengan MySQL", tags: ["Database", "Backend"] },
  { id: "m4", title: "API with Next.js", description: "Membuat REST API", tags: ["Web", "Backend", "NextJS"] },
  { id: "m5", title: "AI Fundamentals", description: "Konsep dasar AI", tags: ["AI", "Data Science"] },
  { id: "m6", title: "React Hooks", description: "State management di React", tags: ["Web", "Frontend", "React"] },
  { id: "m8", title: "Neural Networks 101", description: "Belajar arsitektur otak buatan untuk pemula.", tags: ["AI"] },
  { id: "m9", title: "Data Science with Python", description: "Mengolah data menjadi informasi berharga.", tags: ["AI", "Data Science"] },
];

export const userLogs: UserLog[] = [
  { userId: "u1", modulId: "m1", action: "complete", rating: 5 },
  { userId: "u2", modulId: "m3", action: "complete", rating: 5 },
  { userId: "u3", modulId: "m5", action: "complete", rating: 5 },
  { userId: "u4", modulId: "m1", action: "click", rating: 2 },
  { userId: "u5", modulId: "m2", action: "complete", rating: 5 },
];
