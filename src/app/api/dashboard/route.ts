import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  // Total intake vs admitted
  const totalIntake = db.seatMatrices.reduce((sum, sm) => sum + sm.totalIntake, 0);
  const totalAdmitted = db.applicants.filter((a) => a.status === 'Confirmed').length;

  // Quota-wise stats (aggregate across all programs)
  const quotaMap: Record<string, { total: number; allocated: number }> = {
    KCET: { total: 0, allocated: 0 },
    COMEDK: { total: 0, allocated: 0 },
    Management: { total: 0, allocated: 0 },
  };
  db.seatMatrices.forEach((sm) => {
    sm.quotas.forEach((q) => {
      quotaMap[q.quota].total += q.total;
      quotaMap[q.quota].allocated += q.allocated;
    });
  });

  const quotaStats = Object.entries(quotaMap).map(([quota, v]) => ({
    quota,
    total: v.total,
    allocated: v.allocated,
    remaining: v.total - v.allocated,
  }));

  // Program-wise
  const programWise = db.programs.map((p) => {
    const matrix = db.seatMatrices.find((sm) => sm.programId === p.id);
    const admitted = db.applicants.filter(
      (a) => a.programId === p.id && a.status === 'Confirmed'
    ).length;
    return {
      program: p.name,
      code: p.code,
      intake: matrix?.totalIntake || p.totalIntake,
      admitted,
    };
  });

  // Pending docs & fees
  const pendingDocuments = db.applicants.filter((a) =>
    a.documents.some((d) => d.status === 'Pending' || d.status === 'Submitted')
  ).length;

  const pendingFees = db.applicants.filter(
    (a) => a.feeStatus === 'Pending' && a.status === 'SeatLocked'
  ).length;

  // Status breakdown
  const statusBreakdown = ['Draft', 'Applied', 'SeatLocked', 'Confirmed', 'Cancelled'].map((s) => ({
    status: s,
    count: db.applicants.filter((a) => a.status === s).length,
  }));

  return NextResponse.json({
    data: {
      totalIntake,
      totalAdmitted,
      totalApplicants: db.applicants.length,
      pendingDocuments,
      pendingFees,
      quotaStats,
      programWise,
      statusBreakdown,
      conversionRate: db.applicants.length
        ? Math.round((totalAdmitted / db.applicants.length) * 100)
        : 0,
    },
  });
}
