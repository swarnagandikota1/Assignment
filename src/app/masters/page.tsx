'use client';
import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Table, TableBody,
  TableCell, TableHead, TableRow, Tabs, Tab, Chip, IconButton, Alert, Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SchoolIcon from '@mui/icons-material/School';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/ui/PageHeader';

function TabPanel({ value, index, children }: any) {
  return value === index ? <Box pt={2}>{children}</Box> : null;
}

export default function MastersPage() {
  const [tab, setTab] = useState(0);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [dialog, setDialog] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [snack, setSnack] = useState('');
  const [error, setError] = useState('');

  const loadAll = async () => {
    const [i, c, d, p] = await Promise.all([
      fetch('/api/masters/institutions').then(r => r.json()),
      fetch('/api/masters/campuses').then(r => r.json()),
      fetch('/api/masters/departments').then(r => r.json()),
      fetch('/api/masters/programs').then(r => r.json()),
    ]);
    setInstitutions(i.data || []);
    setCampuses(c.data || []);
    setDepartments(d.data || []);
    setPrograms(p.data || []);
  };

  useEffect(() => { loadAll(); }, []);

  const handleSubmit = async () => {
    setError('');
    const endpoints: Record<string, string> = {
      institution: '/api/masters/institutions',
      campus: '/api/masters/campuses',
      department: '/api/masters/departments',
      program: '/api/masters/programs',
    };
    const res = await fetch(endpoints[dialog!], { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Error'); return; }
    setSnack(data.message);
    setDialog(null);
    setForm({});
    loadAll();
  };

  const TABS = [
    { label: 'Institutions', icon: <BusinessIcon fontSize="small" /> },
    { label: 'Campuses', icon: <LocationCityIcon fontSize="small" /> },
    { label: 'Departments', icon: <AccountTreeIcon fontSize="small" /> },
    { label: 'Programs', icon: <SchoolIcon fontSize="small" /> },
  ];

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <PageHeader
          title="Master Setup"
          subtitle="Configure institutions, campuses, departments and programs"
          breadcrumbs={[{ label: 'Home' }, { label: 'Master Setup' }]}
          action={
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={() => { setDialog(['institution', 'campus', 'department', 'program'][tab]); setForm({}); setError(''); }}>
              Add {['Institution', 'Campus', 'Department', 'Program'][tab]}
            </Button>
          }
        />

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              {TABS.map((t, i) => (
                <Tab key={i} icon={t.icon} iconPosition="start" label={t.label}
                  sx={{ textTransform: 'none', fontWeight: 600, minHeight: 52 }} />
              ))}
            </Tabs>

            <Box sx={{ px: 2 }}>
              {/* Institutions */}
              <TabPanel value={tab} index={0}>
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Name</TableCell><TableCell>Code</TableCell>
                    <TableCell>Address</TableCell><TableCell>Created</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {institutions.map((i) => (
                      <TableRow key={i.id} hover>
                        <TableCell><Typography fontWeight={600} fontSize={13}>{i.name}</Typography></TableCell>
                        <TableCell><Chip label={i.code} size="small" variant="outlined" color="primary" /></TableCell>
                        <TableCell>{i.address}</TableCell>
                        <TableCell>{new Date(i.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {institutions.length === 0 && <TableRow><TableCell colSpan={4}><Typography color="text.secondary" align="center" py={3}>No institutions yet</Typography></TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TabPanel>

              {/* Campuses */}
              <TabPanel value={tab} index={1}>
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Name</TableCell><TableCell>Code</TableCell>
                    <TableCell>Institution</TableCell><TableCell>Location</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {campuses.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell><Typography fontWeight={600} fontSize={13}>{c.name}</Typography></TableCell>
                        <TableCell><Chip label={c.code} size="small" variant="outlined" color="primary" /></TableCell>
                        <TableCell>{c.institutionName}</TableCell>
                        <TableCell>{c.location}</TableCell>
                      </TableRow>
                    ))}
                    {campuses.length === 0 && <TableRow><TableCell colSpan={4}><Typography color="text.secondary" align="center" py={3}>No campuses yet</Typography></TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TabPanel>

              {/* Departments */}
              <TabPanel value={tab} index={2}>
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Name</TableCell><TableCell>Code</TableCell><TableCell>Campus</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {departments.map((d) => (
                      <TableRow key={d.id} hover>
                        <TableCell><Typography fontWeight={600} fontSize={13}>{d.name}</Typography></TableCell>
                        <TableCell><Chip label={d.code} size="small" variant="outlined" color="primary" /></TableCell>
                        <TableCell>{d.campusName}</TableCell>
                      </TableRow>
                    ))}
                    {departments.length === 0 && <TableRow><TableCell colSpan={3}><Typography color="text.secondary" align="center" py={3}>No departments yet</Typography></TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TabPanel>

              {/* Programs */}
              <TabPanel value={tab} index={3}>
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Program</TableCell><TableCell>Code</TableCell>
                    <TableCell>Type</TableCell><TableCell>Entry</TableCell>
                    <TableCell>Mode</TableCell><TableCell align="center">Intake</TableCell>
                    <TableCell>Year</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {programs.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell><Typography fontWeight={600} fontSize={13}>{p.name}</Typography><Typography variant="caption" color="text.secondary">{p.departmentName}</Typography></TableCell>
                        <TableCell><Chip label={p.code} size="small" variant="outlined" color="primary" /></TableCell>
                        <TableCell><Chip label={p.courseType} size="small" color={p.courseType === 'UG' ? 'info' : 'secondary'} /></TableCell>
                        <TableCell>{p.entryType}</TableCell>
                        <TableCell>{p.admissionMode}</TableCell>
                        <TableCell align="center"><b>{p.totalIntake}</b></TableCell>
                        <TableCell>{p.academicYear}</TableCell>
                      </TableRow>
                    ))}
                    {programs.length === 0 && <TableRow><TableCell colSpan={7}><Typography color="text.secondary" align="center" py={3}>No programs yet</Typography></TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TabPanel>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ─── Dialogs ─── */}
      {/* Add Institution */}
      <Dialog open={dialog === 'institution'} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Institution</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Institution Name" fullWidth value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Code (e.g. EIT)" fullWidth value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} />
          <TextField label="Address" fullWidth value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Add Campus */}
      <Dialog open={dialog === 'campus'} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Campus</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField select label="Institution" fullWidth value={form.institutionId || ''} onChange={e => setForm({ ...form, institutionId: e.target.value })}>
            {institutions.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
          </TextField>
          <TextField label="Campus Name" fullWidth value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Code" fullWidth value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} />
          <TextField label="Location" fullWidth value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Add Department */}
      <Dialog open={dialog === 'department'} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField select label="Campus" fullWidth value={form.campusId || ''} onChange={e => setForm({ ...form, campusId: e.target.value })}>
            {campuses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField label="Department Name" fullWidth value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Code" fullWidth value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Add Program */}
      <Dialog open={dialog === 'program'} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Program</DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField select label="Department" fullWidth value={form.departmentId || ''} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
            {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
          </TextField>
          <TextField label="Program Name" fullWidth value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Code (e.g. CSE)" fullWidth value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField select label="Course Type" fullWidth value={form.courseType || 'UG'} onChange={e => setForm({ ...form, courseType: e.target.value })}>
                <MenuItem value="UG">UG</MenuItem><MenuItem value="PG">PG</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Entry Type" fullWidth value={form.entryType || 'Regular'} onChange={e => setForm({ ...form, entryType: e.target.value })}>
                <MenuItem value="Regular">Regular</MenuItem><MenuItem value="Lateral">Lateral</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Admission Mode" fullWidth value={form.admissionMode || 'Both'} onChange={e => setForm({ ...form, admissionMode: e.target.value })}>
                <MenuItem value="Government">Government</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
                <MenuItem value="Both">Both</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField label="Academic Year" fullWidth value={form.academicYear || '2025-26'} onChange={e => setForm({ ...form, academicYear: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Total Intake" type="number" fullWidth value={form.totalIntake || ''} onChange={e => setForm({ ...form, totalIntake: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnack('')}>{snack}</Alert>
      </Snackbar>
    </AppShell>
  );
}
