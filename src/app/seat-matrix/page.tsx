'use client';
import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
  LinearProgress, Chip, Alert, Snackbar, Grid, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/ui/PageHeader';

export default function SeatMatrixPage() {
  const [matrices, setMatrices] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState<any>({ kcetSeats: 0, comedkSeats: 0, managementSeats: 0, supernumerary: 0 });
  const [snack, setSnack] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const [m, p] = await Promise.all([
      fetch('/api/seat-matrix').then(r => r.json()),
      fetch('/api/masters/programs').then(r => r.json()),
    ]);
    setMatrices(m.data || []);
    setPrograms(p.data || []);
  };
  useEffect(() => { load(); }, []);

  // Auto-calculate totalIntake from quota sum
  const quotaTotal = Number(form.kcetSeats || 0) + Number(form.comedkSeats || 0) + Number(form.managementSeats || 0);

  const handleOpen = (matrix?: any) => {
    if (matrix) {
      setEditing(matrix);
      setForm({
        programId: matrix.programId,
        academicYear: matrix.academicYear,
        totalIntake: matrix.totalIntake,
        kcetSeats: matrix.quotas.find((q: any) => q.quota === 'KCET')?.total || 0,
        comedkSeats: matrix.quotas.find((q: any) => q.quota === 'COMEDK')?.total || 0,
        managementSeats: matrix.quotas.find((q: any) => q.quota === 'Management')?.total || 0,
        supernumerary: matrix.supernumerary || 0,
      });
    } else {
      setEditing(null);
      setForm({ kcetSeats: 0, comedkSeats: 0, managementSeats: 0, supernumerary: 0 });
    }
    setError('');
    setDialog(true);
  };

  const handleSubmit = async () => {
    setError('');
    const payload = { ...form, totalIntake: quotaTotal };
    const res = await fetch('/api/seat-matrix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setSnack(data.message);
    setDialog(false);
    load();
  };

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <PageHeader
          title="Seat Matrix & Quotas"
          subtitle="Configure intake and quota distribution per program"
          breadcrumbs={[{ label: 'Home' }, { label: 'Seat Matrix' }]}
          action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Configure Matrix</Button>}
        />

        <Alert severity="info" sx={{ mb: 3 }}>
          <b>Key Rule:</b> KCET + COMEDK + Management seats must exactly equal total intake. Allocation is blocked when quota is full.
        </Alert>

        <Grid container spacing={2.5}>
          {matrices.map((m) => {
            const prog = programs.find((p: any) => p.id === m.programId);
            const totalAllocated = m.quotas.reduce((s: number, q: any) => s + q.allocated, 0);
            const fillPct = m.totalIntake ? Math.round((totalAllocated / m.totalIntake) * 100) : 0;
            return (
              <Grid item xs={12} md={6} key={m.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography fontWeight={700} fontSize={15}>{prog?.name || m.programCode}</Typography>
                        <Typography variant="caption" color="text.secondary">AY: {m.academicYear} | Intake: {m.totalIntake}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={`${totalAllocated}/${m.totalIntake} filled`}
                          color={fillPct > 80 ? 'error' : fillPct > 50 ? 'warning' : 'success'} size="small" />
                        <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpen(m)}>Edit</Button>
                      </Box>
                    </Box>

                    <LinearProgress variant="determinate" value={fillPct} sx={{ mb: 2, height: 8, borderRadius: 4 }}
                      color={fillPct > 80 ? 'error' : fillPct > 50 ? 'warning' : 'primary'} />

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Quota</TableCell>
                          <TableCell align="center">Total</TableCell>
                          <TableCell align="center">Allocated</TableCell>
                          <TableCell align="center">Remaining</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {m.quotas.map((q: any) => {
                          const rem = q.total - q.allocated;
                          return (
                            <TableRow key={q.quota}>
                              <TableCell><Typography fontWeight={600} fontSize={13}>{q.quota}</Typography></TableCell>
                              <TableCell align="center">{q.total}</TableCell>
                              <TableCell align="center">{q.allocated}</TableCell>
                              <TableCell align="center"><b>{rem}</b></TableCell>
                              <TableCell>
                                {rem === 0
                                  ? <Chip label="FULL" size="small" color="error" />
                                  : rem <= 5
                                  ? <Chip label="Low" size="small" color="warning" />
                                  : <Chip label="Available" size="small" color="success" />}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {m.supernumerary > 0 && (
                          <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                            <TableCell><Typography fontWeight={600} fontSize={13} color="text.secondary">Supernumerary</Typography></TableCell>
                            <TableCell align="center">{m.supernumerary}</TableCell>
                            <TableCell align="center">{m.supernumeraryAllocated}</TableCell>
                            <TableCell align="center"><b>{m.supernumerary - m.supernumeraryAllocated}</b></TableCell>
                            <TableCell><Chip label="Separate" size="small" variant="outlined" /></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          {matrices.length === 0 && (
            <Grid item xs={12}>
              <Card><CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">No seat matrix configured yet. Click "Configure Matrix" to begin.</Typography>
              </CardContent></Card>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Seat Matrix' : 'Configure Seat Matrix'}</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField select label="Program" fullWidth value={form.programId || ''} onChange={e => setForm({ ...form, programId: e.target.value })}>
            {programs.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name} ({p.code})</MenuItem>)}
          </TextField>
          <TextField label="Academic Year" fullWidth value={form.academicYear || '2025-26'} onChange={e => setForm({ ...form, academicYear: e.target.value })} />
          <Divider><Typography variant="caption" color="text.secondary">Quota Distribution</Typography></Divider>
          <Alert severity="info" sx={{ py: 0.5 }}>
            KCET + COMEDK + Management = <b>{quotaTotal}</b> (must equal total intake)
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField label="KCET Seats" type="number" fullWidth value={form.kcetSeats} onChange={e => setForm({ ...form, kcetSeats: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="COMEDK Seats" type="number" fullWidth value={form.comedkSeats} onChange={e => setForm({ ...form, comedkSeats: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Mgmt Seats" type="number" fullWidth value={form.managementSeats} onChange={e => setForm({ ...form, managementSeats: e.target.value })} />
            </Grid>
          </Grid>
          <TextField label="Supernumerary Seats (Optional)" type="number" fullWidth value={form.supernumerary} onChange={e => setForm({ ...form, supernumerary: e.target.value })} helperText="Separate counter, not included in base intake" />
          <Box sx={{ bgcolor: '#F0F4FA', borderRadius: 2, p: 1.5, display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight={600}>Total Intake</Typography>
            <Typography fontWeight={800} color="primary.main">{quotaTotal}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save Matrix</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </AppShell>
  );
}
