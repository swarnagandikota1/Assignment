'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select,
  Alert, Snackbar, CircularProgress, Paper, Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import BadgeIcon from '@mui/icons-material/Badge';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import StatusChip from '@/components/ui/StatusChip';

const DOC_STATUSES = ['Pending', 'Submitted', 'Verified'];

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState('');
  const [snackSev, setSnackSev] = useState<'success' | 'error' | 'info'>('success');
  const [allocating, setAllocating] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/applicants/${id}`);
    const data = await res.json();
    setApplicant(data.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const updateDocStatus = async (docIndex: number, status: string) => {
    const docs = [...applicant.documents];
    docs[docIndex] = { ...docs[docIndex], status };
    const res = await fetch(`/api/applicants/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: docs }),
    });
    const data = await res.json();
    setApplicant(data.data);
    showSnack('Document status updated', 'success');
  };

  const markFeePaid = async () => {
    const res = await fetch(`/api/applicants/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeStatus: 'Paid' }),
    });
    const data = await res.json();
    setApplicant(data.data);
    showSnack('Fee marked as Paid', 'success');
  };

  const lockSeat = async () => {
    setAllocating(true);
    const res = await fetch('/api/admissions/allocate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantId: id }),
    });
    const data = await res.json();
    if (!res.ok) { showSnack(data.error, 'error'); }
    else { setApplicant(data.data); showSnack(data.message, 'success'); }
    setAllocating(false);
  };

  const confirmAdmission = async () => {
    setConfirming(true);
    const res = await fetch('/api/admissions/confirm', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantId: id }),
    });
    const data = await res.json();
    if (!res.ok) { showSnack(data.error, 'error'); }
    else { setApplicant(data.data); showSnack(data.message, 'success'); }
    setConfirming(false);
  };

  const showSnack = (msg: string, sev: 'success' | 'error' | 'info') => { setSnack(msg); setSnackSev(sev); };

  if (loading) return <AppShell><Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box></AppShell>;
  if (!applicant) return <AppShell><Box sx={{ p: 4 }}><Alert severity="error">Applicant not found</Alert></Box></AppShell>;

  const allDocsVerified = applicant.documents.every((d: any) => d.status === 'Verified');
  const workflowSteps = [
    { label: 'Applied', done: true },
    { label: 'Seat Locked', done: ['SeatLocked', 'Confirmed'].includes(applicant.status) },
    { label: 'Docs Verified', done: allDocsVerified },
    { label: 'Fee Paid', done: applicant.feeStatus === 'Paid' },
    { label: 'Confirmed', done: applicant.status === 'Confirmed' },
  ];

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <PageHeader
          title={`${applicant.firstName} ${applicant.lastName}`}
          subtitle="Applicant Detail & Admission Workflow"
          breadcrumbs={[{ label: 'Home' }, { label: 'Applicants', href: '/applicants' }, { label: `${applicant.firstName} ${applicant.lastName}` }]}
          action={<Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>Back</Button>}
        />

        {/* Admission Number Banner */}
        {applicant.admissionNumber && (
          <Paper sx={{ p: 2.5, mb: 3, bgcolor: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <BadgeIcon color="success" fontSize="large" />
            <Box>
              <Typography variant="caption" color="success.dark" fontWeight={700}>ADMISSION CONFIRMED</Typography>
              <Typography variant="h5" fontWeight={800} sx={{ fontFamily: 'monospace', color: 'success.dark' }}>
                {applicant.admissionNumber}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Workflow Steps */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={700} mb={2}>Admission Workflow</Typography>
            <Stack direction="row" spacing={0} sx={{ overflowX: 'auto' }}>
              {workflowSteps.map((step, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '50%', mx: 'auto', mb: 0.5,
                      bgcolor: step.done ? 'success.main' : '#E0E0E0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {step.done ? <CheckCircleIcon sx={{ color: '#fff', fontSize: 20 }} /> :
                        <Typography fontSize={13} fontWeight={700} color="text.secondary">{i + 1}</Typography>}
                    </Box>
                    <Typography variant="caption" fontWeight={step.done ? 700 : 400} color={step.done ? 'success.main' : 'text.secondary'}>
                      {step.label}
                    </Typography>
                  </Box>
                  {i < workflowSteps.length - 1 && (
                    <Box sx={{ width: 40, height: 2, bgcolor: step.done ? 'success.main' : '#E0E0E0', flexShrink: 0 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Personal Details */}
          <Grid item xs={12} md={5}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography fontWeight={700} mb={2}>Personal Information</Typography>
                {[
                  ['Full Name', `${applicant.firstName} ${applicant.lastName}`],
                  ['Email', applicant.email],
                  ['Phone', applicant.phone],
                  ['Date of Birth', applicant.dob],
                  ['Gender', applicant.gender],
                  ['Category', applicant.category],
                  ['State', applicant.state],
                ].map(([label, val]) => (
                  <Box key={label} sx={{ display: 'flex', py: 0.8, borderBottom: '1px solid #F5F5F5' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ width: 130, flexShrink: 0 }}>{label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{val || '—'}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography fontWeight={700} mb={2}>Admission Details</Typography>
                {[
                  ['Program', applicant.programName],
                  ['Quota', applicant.quotaType],
                  ['Entry Type', applicant.entryType],
                  ['Admission Mode', applicant.admissionMode],
                  ['Allotment No.', applicant.allotmentNumber || '—'],
                  ['Qualifying Exam', applicant.qualifyingExam],
                  ['Marks', `${applicant.qualifyingMarks}%`],
                  ['Rank', applicant.rank || '—'],
                ].map(([label, val]) => (
                  <Box key={label} sx={{ display: 'flex', py: 0.8, borderBottom: '1px solid #F5F5F5' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ width: 130, flexShrink: 0 }}>{label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{val}</Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', py: 0.8, mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 130 }}>Status</Typography>
                  <StatusChip status={applicant.status} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right side: docs, fee, actions */}
          <Grid item xs={12} md={7}>
            {/* Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography fontWeight={700} mb={2}>Actions</Typography>
                <Stack spacing={1.5}>
                  {/* Lock Seat */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                    <Box>
                      <Typography fontWeight={600} fontSize={14} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EventSeatIcon fontSize="small" color="primary" /> Lock Seat
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Reserves a quota seat for this applicant</Typography>
                    </Box>
                    {applicant.status === 'SeatLocked' || applicant.status === 'Confirmed'
                      ? <Chip label="Seat Locked" color="success" size="small" />
                      : <Button variant="contained" size="small" disabled={allocating || applicant.status === 'Cancelled'} onClick={lockSeat}>
                          {allocating ? 'Locking…' : 'Lock Seat'}
                        </Button>}
                  </Box>

                  {/* Fee Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                    <Box>
                      <Typography fontWeight={600} fontSize={14} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PaymentIcon fontSize="small" color="warning" /> Fee Status
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Admission confirms only after fee is paid</Typography>
                    </Box>
                    {applicant.feeStatus === 'Paid'
                      ? <Chip label="Paid" color="success" />
                      : <Button variant="outlined" color="warning" size="small" onClick={markFeePaid}>Mark as Paid</Button>}
                  </Box>

                  {/* Confirm Admission */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5,
                    bgcolor: applicant.status === 'Confirmed' ? '#E8F5E9' : '#F8F9FA', borderRadius: 2,
                    border: applicant.status === 'Confirmed' ? '1px solid #A5D6A7' : 'none' }}>
                    <Box>
                      <Typography fontWeight={600} fontSize={14} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon fontSize="small" color="success" /> Confirm Admission
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {applicant.feeStatus !== 'Paid' ? '⚠ Fee must be paid first' : applicant.status !== 'SeatLocked' ? '⚠ Lock seat first' : 'Ready to confirm'}
                      </Typography>
                    </Box>
                    {applicant.status === 'Confirmed'
                      ? <Chip label="Confirmed ✓" color="success" />
                      : <Button variant="contained" color="success" size="small"
                          disabled={confirming || applicant.status !== 'SeatLocked' || applicant.feeStatus !== 'Paid'}
                          onClick={confirmAdmission}>
                          {confirming ? 'Confirming…' : 'Confirm'}
                        </Button>}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Document Checklist */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography fontWeight={700}>Document Checklist</Typography>
                  <Chip label={`${applicant.documents.filter((d: any) => d.status === 'Verified').length}/${applicant.documents.length} verified`}
                    size="small" color={allDocsVerified ? 'success' : 'warning'} />
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicant.documents.map((doc: any, i: number) => (
                      <TableRow key={i} hover>
                        <TableCell><Typography fontSize={13}>{doc.name}</Typography></TableCell>
                        <TableCell>
                          <Select size="small" value={doc.status}
                            onChange={e => updateDocStatus(i, e.target.value)}
                            disabled={applicant.status === 'Confirmed'}
                            sx={{ fontSize: 12, minWidth: 110 }}>
                            {DOC_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackSev} onClose={() => setSnack('')}>{snack}</Alert>
      </Snackbar>
    </AppShell>
  );
}
