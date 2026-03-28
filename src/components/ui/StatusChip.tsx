'use client';
import { Chip } from '@mui/material';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Draft:      { bg: '#F0F4FA', color: '#5A6A7E' },
  Applied:    { bg: '#E3F2FD', color: '#1565C0' },
  SeatLocked: { bg: '#FFF3E0', color: '#E65100' },
  Confirmed:  { bg: '#E8F5E9', color: '#2E7D32' },
  Cancelled:  { bg: '#FFEBEE', color: '#C62828' },
  Pending:    { bg: '#FFF8E1', color: '#F57F17' },
  Submitted:  { bg: '#E3F2FD', color: '#1565C0' },
  Verified:   { bg: '#E8F5E9', color: '#2E7D32' },
  Paid:       { bg: '#E8F5E9', color: '#2E7D32' },
};

export default function StatusChip({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || { bg: '#F5F5F5', color: '#757575' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: 11 }}
    />
  );
}
