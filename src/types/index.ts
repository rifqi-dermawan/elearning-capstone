export interface Modul {
  id: string;
  title: string;
  description: string;
  tags: string[]; 
}

export interface UserLog {
  userId: string;
  modulId: string;
  action: "click" | "complete"; 
  rating?: number; 
}

export interface Recommendation {
  modulId: string;
  title: string;
  reason: string;
}
