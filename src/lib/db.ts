import { Institution, Campus, Department, Program, SeatMatrix, Applicant } from '@/types';

// ─── In-memory store (acts as our DB) ──────────────────────────────
// In production, replace with Prisma/MongoDB/etc.

export const db: {
  institutions: Institution[];
  campuses: Campus[];
  departments: Department[];
  programs: Program[];
  seatMatrices: SeatMatrix[];
  applicants: Applicant[];
} = {
  institutions: [
    {
      id: 'inst-1',
      name: 'Edumerge Institute of Technology',
      code: 'EIT',
      address: 'Bengaluru, Karnataka',
      createdAt: new Date().toISOString(),
    },
  ],
  campuses: [
    {
      id: 'campus-1',
      institutionId: 'inst-1',
      name: 'Main Campus',
      code: 'MC',
      location: 'Bengaluru',
    },
  ],
  departments: [
    { id: 'dept-1', campusId: 'campus-1', name: 'Computer Science', code: 'CSE' },
    { id: 'dept-2', campusId: 'campus-1', name: 'Electronics & Communication', code: 'ECE' },
    { id: 'dept-3', campusId: 'campus-1', name: 'Mechanical Engineering', code: 'ME' },
  ],
  programs: [
    {
      id: 'prog-1',
      departmentId: 'dept-1',
      name: 'B.Tech Computer Science',
      code: 'CSE',
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Both',
      academicYear: '2025-26',
      totalIntake: 60,
    },
    {
      id: 'prog-2',
      departmentId: 'dept-2',
      name: 'B.Tech Electronics',
      code: 'ECE',
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Both',
      academicYear: '2025-26',
      totalIntake: 60,
    },
    {
      id: 'prog-3',
      departmentId: 'dept-3',
      name: 'B.Tech Mechanical',
      code: 'ME',
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Both',
      academicYear: '2025-26',
      totalIntake: 30,
    },
  ],
  seatMatrices: [
    {
      id: 'sm-1',
      programId: 'prog-1',
      academicYear: '2025-26',
      totalIntake: 60,
      quotas: [
        { quota: 'KCET', total: 30, allocated: 12 },
        { quota: 'COMEDK', total: 20, allocated: 5 },
        { quota: 'Management', total: 10, allocated: 3 },
      ],
      supernumerary: 5,
      supernumeraryAllocated: 1,
    },
    {
      id: 'sm-2',
      programId: 'prog-2',
      academicYear: '2025-26',
      totalIntake: 60,
      quotas: [
        { quota: 'KCET', total: 30, allocated: 8 },
        { quota: 'COMEDK', total: 20, allocated: 4 },
        { quota: 'Management', total: 10, allocated: 2 },
      ],
      supernumerary: 5,
      supernumeraryAllocated: 0,
    },
    {
      id: 'sm-3',
      programId: 'prog-3',
      academicYear: '2025-26',
      totalIntake: 30,
      quotas: [
        { quota: 'KCET', total: 15, allocated: 4 },
        { quota: 'COMEDK', total: 10, allocated: 2 },
        { quota: 'Management', total: 5, allocated: 1 },
      ],
      supernumerary: 2,
      supernumeraryAllocated: 0,
    },
  ],
  applicants: [
    {
      id: 'app-1',
      firstName: 'Ravi',
      lastName: 'Kumar',
      email: 'ravi.kumar@email.com',
      phone: '9876543210',
      dob: '2005-06-15',
      gender: 'Male',
      category: 'GM',
      state: 'Karnataka',
      programId: 'prog-1',
      entryType: 'Regular',
      quotaType: 'KCET',
      admissionMode: 'Government',
      allotmentNumber: 'KCET2025-001234',
      qualifyingExam: 'PUC',
      qualifyingMarks: 92,
      rank: 4520,
      status: 'Confirmed',
      feeStatus: 'Paid',
      admissionNumber: 'EIT/2025/UG/CSE/KCET/0001',
      documents: [
        { name: '10th Marks Card', status: 'Verified' },
        { name: '12th Marks Card', status: 'Verified' },
        { name: 'KCET Rank Card', status: 'Verified' },
        { name: 'Transfer Certificate', status: 'Verified' },
        { name: 'Aadhar Card', status: 'Verified' },
      ],
      createdAt: new Date('2025-06-01').toISOString(),
      updatedAt: new Date('2025-06-05').toISOString(),
    },
    {
      id: 'app-2',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@email.com',
      phone: '9812345678',
      dob: '2005-03-22',
      gender: 'Female',
      category: 'OBC',
      state: 'Karnataka',
      programId: 'prog-1',
      entryType: 'Regular',
      quotaType: 'COMEDK',
      admissionMode: 'Government',
      allotmentNumber: 'COMEDK2025-005678',
      qualifyingExam: 'PUC',
      qualifyingMarks: 88,
      rank: 1205,
      status: 'SeatLocked',
      feeStatus: 'Pending',
      documents: [
        { name: '10th Marks Card', status: 'Submitted' },
        { name: '12th Marks Card', status: 'Verified' },
        { name: 'COMEDK Rank Card', status: 'Verified' },
        { name: 'Transfer Certificate', status: 'Pending' },
        { name: 'Aadhar Card', status: 'Submitted' },
      ],
      createdAt: new Date('2025-06-02').toISOString(),
      updatedAt: new Date('2025-06-03').toISOString(),
    },
    {
      id: 'app-3',
      firstName: 'Arjun',
      lastName: 'Nair',
      email: 'arjun.nair@email.com',
      phone: '9988776655',
      dob: '2004-11-10',
      gender: 'Male',
      category: 'SC',
      state: 'Kerala',
      programId: 'prog-2',
      entryType: 'Regular',
      quotaType: 'Management',
      admissionMode: 'Management',
      qualifyingExam: 'PUC',
      qualifyingMarks: 75,
      status: 'Applied',
      feeStatus: 'Pending',
      documents: [
        { name: '10th Marks Card', status: 'Submitted' },
        { name: '12th Marks Card', status: 'Pending' },
        { name: 'Caste Certificate', status: 'Pending' },
        { name: 'Transfer Certificate', status: 'Pending' },
        { name: 'Aadhar Card', status: 'Submitted' },
      ],
      createdAt: new Date('2025-06-04').toISOString(),
      updatedAt: new Date('2025-06-04').toISOString(),
    },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────

/** Generate unique admission number: INST/YEAR/TYPE/PROG/QUOTA/XXXX */
export function generateAdmissionNumber(
  institutionCode: string,
  year: string,
  courseType: string,
  programCode: string,
  quota: string
): string {
  const existing = db.applicants.filter((a) => a.admissionNumber).length;
  const seq = String(existing + 1).padStart(4, '0');
  return `${institutionCode}/${year}/${courseType}/${programCode}/${quota}/${seq}`;
}

/** Check if quota has available seats */
export function checkSeatAvailability(
  programId: string,
  quotaType: string
): { available: boolean; remaining: number; matrix: SeatMatrix | null } {
  const matrix = db.seatMatrices.find((sm) => sm.programId === programId);
  if (!matrix) return { available: false, remaining: 0, matrix: null };

  const quotaSeat = matrix.quotas.find((q) => q.quota === quotaType);
  if (!quotaSeat) return { available: false, remaining: 0, matrix };

  const remaining = quotaSeat.total - quotaSeat.allocated;
  return { available: remaining > 0, remaining, matrix };
}
