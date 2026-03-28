// ─── Master Types ───────────────────────────────────────────────────
export interface Institution {
  id: string;
  name: string;
  code: string;
  address: string;
  createdAt: string;
}

export interface Campus {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  location: string;
}

export interface Department {
  id: string;
  campusId: string;
  name: string;
  code: string;
}

export interface Program {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  courseType: 'UG' | 'PG';
  entryType: 'Regular' | 'Lateral';
  admissionMode: 'Government' | 'Management' | 'Both';
  academicYear: string;
  totalIntake: number;
}

// ─── Seat Matrix ────────────────────────────────────────────────────
export type QuotaType = 'KCET' | 'COMEDK' | 'Management';

export interface QuotaSeat {
  quota: QuotaType;
  total: number;
  allocated: number;
}

export interface SeatMatrix {
  id: string;
  programId: string;
  academicYear: string;
  totalIntake: number;
  quotas: QuotaSeat[];
  supernumerary: number;
  supernumeraryAllocated: number;
}

// ─── Applicant ──────────────────────────────────────────────────────
export type DocStatus = 'Pending' | 'Submitted' | 'Verified';
export type ApplicantStatus = 'Draft' | 'Applied' | 'SeatLocked' | 'Confirmed' | 'Cancelled';

export interface Applicant {
  id: string;
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'GM' | 'SC' | 'ST' | 'OBC' | 'EWS';
  state: string;
  // Admission
  programId: string;
  entryType: 'Regular' | 'Lateral';
  quotaType: QuotaType;
  admissionMode: 'Government' | 'Management';
  allotmentNumber?: string; // for govt flow
  qualifyingExam: string;
  qualifyingMarks: number;
  rank?: number;
  // Status
  status: ApplicantStatus;
  feeStatus: 'Pending' | 'Paid';
  admissionNumber?: string;
  // Documents
  documents: {
    name: string;
    status: DocStatus;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ──────────────────────────────────────────────────────
export interface DashboardData {
  totalIntake: number;
  totalAdmitted: number;
  pendingDocuments: number;
  pendingFees: number;
  quotaStats: {
    quota: QuotaType;
    total: number;
    allocated: number;
    remaining: number;
  }[];
  programWise: {
    program: string;
    intake: number;
    admitted: number;
  }[];
}
