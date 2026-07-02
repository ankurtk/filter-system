// ============================================================
// employee.types.ts
// TypeScript model for the Employee data used in the demo table.
// ============================================================

export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;         // ISO date string: "2021-03-15"
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string;       // ISO date string
  performanceRating: number; // 1.0 – 5.0
}
