'use client';
import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, Button, Alert, Grid, Paper, Divider, CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import StatusChip from '@/components/ui/StatusChip';

export default function AdmissionsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/applicants')
      .then(r => r.json())
      .then(d => { setApplicants(d.data || []); setLoading(false); });
  }, []);

  const confirmed = applicants.filter(a => a.status === 'Confirmed');
  const seatLocked = applicants.filter(a => a.status === 'SeatLocked');
  const pending = applicants.filter(a => a.status === 'Applied');
  const feePending = applicants.filter(a => a.status === 'SeatLocked' && a.feeStatus === 'Pending');

  const StatBox = ({ label, value, icon, color }: any) => (
    <Paper sx={{ p: 2.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, border: `1px solid ${color}22` }}>
      <Box sx={{ color, fontSize: 36 }}>{icon}</Box>
      <Box>
        <Typography variant="h4" fontWeight={800} color={color}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Paper>
  );

  if (loading) return <AppShell><Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box></AppShell>;

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <PageHeader
          title="Admissions"
          subtitle="Track seat allocations, pending fees, and confirmed admissions"
          breadcrumbs={[{ label: 'Home' }, { label: 'Admissions' }]}
        />

        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatBox label="Confirmed Admissions" value={confirmed.length} icon={<CheckCircleIcon fontSize="inherit" />} color="#2E7D32" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatBox label="Seat Locked" value={seatLocked.length} icon={<HourglassEmptyIcon fontSize="inherit" />} color="#E8571A" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatBox label="Applied (Pending)" value={pending.length} icon={<HourglassEmptyIcon fontSize="inherit" />} color="#1B3A6B" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatBox label="Fee Pending" value={feePending.length} icon={<ErrorIcon fontSize="inherit" />} color="#ED6C02" />
          </Grid>
        </Grid>

        {/* Fee pending alert */}
        {feePending.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <b>{feePending.length} applicant{feePending.length > 1 ? 's have' : ' has'} seat locked but fee not paid.</b> Confirm admission only after fee is marked Paid.
          </Alert>
        )}

        {/* Confirmed admissions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" /> Confirmed Admissions ({confirmed.length})
            </Typography>
            {confirmed.length === 0
              ? <Typography color="text.secondary" align="center" py={3}>No confirmed admissions yet</Typography>
              : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Admission Number</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Program</TableCell>
                      <TableCell>Quota</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {confirmed.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>
                          <Typography fontSize={12} fontWeight={800} sx={{ fontFamily: 'monospace', color: 'success.main' }}>
                            {a.admissionNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600} fontSize={13}>{a.firstName} {a.lastName}</Typography>
                          <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                        </TableCell>
                        <TableCell>{a.programName}</TableCell>
                        <TableCell><Chip label={a.quotaType} size="small" variant="outlined" /></TableCell>
                        <TableCell align="center">
                          <Button size="small" startIcon={<VisibilityIcon />} onClick={() => router.push(`/applicants/${a.id}`)}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
          </CardContent>
        </Card>

        {/* Pending actions */}
        <Card>
          <CardContent>
            <Typography fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HourglassEmptyIcon color="warning" fontSize="small" /> Pending Actions ({seatLocked.length + pending.length})
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Quota</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Next Action</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...seatLocked, ...pending].map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={13}>{a.firstName} {a.lastName}</Typography>
                    </TableCell>
                    <TableCell>{a.programName}</TableCell>
                    <TableCell><Chip label={a.quotaType} size="small" variant="outlined" /></TableCell>
                    <TableCell><StatusChip status={a.status} /></TableCell>
                    <TableCell><StatusChip status={a.feeStatus} /></TableCell>
                    <TableCell>
                      <Typography fontSize={12} color="text.secondary">
                        {a.status === 'Applied' ? '→ Lock Seat' : a.feeStatus === 'Pending' ? '→ Mark Fee Paid' : '→ Confirm Admission'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => router.push(`/applicants/${a.id}`)}>Open</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {seatLocked.length + pending.length === 0 && (
                  <TableRow><TableCell colSpan={7}>
                    <Typography align="center" color="text.secondary" py={3}>No pending actions</Typography>
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </AppShell>
  );
}
