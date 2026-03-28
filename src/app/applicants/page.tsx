'use client';
import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Table, TableBody, TableCell, TableHead,
  TableRow, Chip, Alert, Snackbar, Grid, InputAdornment, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import StatusChip from '@/components/ui/StatusChip';

const CATEGORIES = ['GM', 'SC', 'ST', 'OBC', 'EWS'];
const QUOTA_TYPES = ['KCET', 'COMEDK', 'Management'];

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState<any>({ gender: 'Male', category: 'GM', quotaType: 'KCET', admissionMode: 'Government', entryType: 'Regular' });
  const [snack, setSnack] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const router = useRouter();

  const load = async () => {
    const [a, p] = await Promise.all([
      fetch('/api/applicants').then(r => r.json()),
      fetch('/api/masters/programs').then(r => r.json()),
    ]);
    setApplicants(a.data || []);
    setPrograms(p.data || []);
  };
  useEffect(() => { load(); }, []);

  const filtered = applicants.filter(a => {
    const matchSearch = !search ||
      `${a.firstName} ${a.lastName} ${a.email} ${a.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmit = async () => {
    setError('');
    const res = await fetch('/api/applicants', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setSnack(data.message);
    setDialog(false);
    setForm({ gender: 'Male', category: 'GM', quotaType: 'KCET', admissionMode: 'Government', entryType: 'Regular' });
    load();
  };

  const STATUSES = ['', 'Draft', 'Applied', 'SeatLocked', 'Confirmed', 'Cancelled'];

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <PageHeader
          title="Applicants"
          subtitle="Manage all applicants and their admission details"
          breadcrumbs={[{ label: 'Home' }, { label: 'Applicants' }]}
          action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => { setDialog(true); setError(''); }}>New Applicant</Button>}
        />

        <Card>
          <CardContent>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                sx={{ width: 280 }} />
              <TextField select size="small" label="Status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} sx={{ width: 160 }}>
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s || 'All Statuses'}</MenuItem>)}
              </TextField>
              <Chip label={`${filtered.length} total`} variant="outlined" sx={{ alignSelf: 'center' }} />
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Quota</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Admission No.</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={13}>{a.firstName} {a.lastName}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={12}>{a.programName}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.admissionMode}</Typography>
                    </TableCell>
                    <TableCell><Chip label={a.quotaType} size="small" variant="outlined" /></TableCell>
                    <TableCell>{a.category}</TableCell>
                    <TableCell><StatusChip status={a.status} /></TableCell>
                    <TableCell><StatusChip status={a.feeStatus} /></TableCell>
                    <TableCell>
                      {a.admissionNumber
                        ? <Typography fontSize={11} fontWeight={700} color="success.main" sx={{ fontFamily: 'monospace' }}>{a.admissionNumber}</Typography>
                        : <Typography color="text.disabled" fontSize={11}>—</Typography>}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => router.push(`/applicants/${a.id}`)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8}>
                    <Typography align="center" color="text.secondary" py={4}>No applicants found</Typography>
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      {/* New Applicant Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Applicant</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="First Name *" fullWidth value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Last Name *" fullWidth value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Email *" fullWidth type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Phone *" fullWidth value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></Grid>
            <Grid item xs={4}><TextField label="Date of Birth" fullWidth type="date" InputLabelProps={{ shrink: true }} value={form.dob || ''} onChange={e => setForm({ ...form, dob: e.target.value })} /></Grid>
            <Grid item xs={4}>
              <TextField select label="Gender" fullWidth value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                {['Male', 'Female', 'Other'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField select label="Category" fullWidth value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField label="State" fullWidth value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })} /></Grid>
            <Grid item xs={6}>
              <TextField select label="Program *" fullWidth value={form.programId || ''} onChange={e => setForm({ ...form, programId: e.target.value })}>
                {programs.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField select label="Quota Type *" fullWidth value={form.quotaType} onChange={e => setForm({ ...form, quotaType: e.target.value, admissionMode: e.target.value === 'Management' ? 'Management' : 'Government' })}>
                {QUOTA_TYPES.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField select label="Entry Type" fullWidth value={form.entryType} onChange={e => setForm({ ...form, entryType: e.target.value })}>
                <MenuItem value="Regular">Regular</MenuItem><MenuItem value="Lateral">Lateral</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField label="Admission Mode" fullWidth value={form.admissionMode} disabled />
            </Grid>
            {form.admissionMode === 'Government' && (
              <Grid item xs={6}><TextField label="Allotment Number" fullWidth value={form.allotmentNumber || ''} onChange={e => setForm({ ...form, allotmentNumber: e.target.value })} helperText="KCET/COMEDK allotment number" /></Grid>
            )}
            <Grid item xs={form.admissionMode === 'Government' ? 3 : 6}><TextField label="Qualifying Exam" fullWidth value={form.qualifyingExam || ''} onChange={e => setForm({ ...form, qualifyingExam: e.target.value })} /></Grid>
            <Grid item xs={form.admissionMode === 'Government' ? 3 : 6}><TextField label="Marks (%)" type="number" fullWidth value={form.qualifyingMarks || ''} onChange={e => setForm({ ...form, qualifyingMarks: e.target.value })} /></Grid>
            {form.admissionMode === 'Government' && (
              <Grid item xs={6}><TextField label="Rank" type="number" fullWidth value={form.rank || ''} onChange={e => setForm({ ...form, rank: e.target.value })} /></Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create Applicant</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </AppShell>
  );
}
