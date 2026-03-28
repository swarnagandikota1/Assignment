'use client';
import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, LinearProgress,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, CircularProgress, Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PaymentIcon from '@mui/icons-material/Payment';
import ArticleIcon from '@mui/icons-material/Article';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/ui/PageHeader';

const QUOTA_COLORS: Record<string, string> = { KCET: '#1B3A6B', COMEDK: '#E8571A', Management: '#2E7D32' };

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Box sx={{ bgcolor: `${color}18`, borderRadius: 2.5, p: 1.5, color, display: 'flex' }}>{icon}</Box>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">{value}</Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          {sub && <Typography variant="caption" color="text.disabled">{sub}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((res) => { setData(res.data); setLoading(false); });
  }, []);

  if (loading) return (
    <AppShell>
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
    </AppShell>
  );

  const fillRate = data.totalIntake ? Math.round((data.totalAdmitted / data.totalIntake) * 100) : 0;

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <PageHeader
          title="Dashboard"
          subtitle="Real-time overview of admission progress"
          breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
        />

        {/* Stat Cards */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<EventSeatIcon />} label="Total Intake" value={data.totalIntake} sub="All programs" color="#1B3A6B" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<CheckCircleIcon />} label="Admitted" value={data.totalAdmitted} sub={`${fillRate}% filled`} color="#2E7D32" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<PeopleIcon />} label="Total Applicants" value={data.totalApplicants} sub="All statuses" color="#E8571A" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<PaymentIcon />} label="Pending Fees" value={data.pendingFees} sub="Seat locked" color="#ED6C02" />
          </Grid>
        </Grid>

        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<ArticleIcon />} label="Pending Docs" value={data.pendingDocuments} sub="Incomplete checklist" color="#9C27B0" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<CheckCircleIcon />} label="Conversion Rate" value={`${data.conversionRate}%`} sub="Applied → Confirmed" color="#0288D1" />
          </Grid>
        </Grid>

        {/* Overall fill bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography fontWeight={700}>Overall Seat Utilisation</Typography>
              <Typography fontWeight={700} color="primary.main">{data.totalAdmitted} / {data.totalIntake}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={fillRate} sx={{ height: 12, borderRadius: 6 }} />
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{fillRate}% seats filled</Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Quota-wise chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Quota-wise Seat Status</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.quotaStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quota" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="total" name="Total" fill="#E8F0FE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="allocated" name="Allocated" radius={[4, 4, 0, 0]}>
                      {data.quotaStats.map((entry: any, i: number) => (
                        <Cell key={i} fill={QUOTA_COLORS[entry.quota] || '#888'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Quota detail rows */}
                <Box mt={2}>
                  {data.quotaStats.map((q: any) => (
                    <Box key={q.quota} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: QUOTA_COLORS[q.quota] || '#888', flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight={600} sx={{ width: 110 }}>{q.quota}</Typography>
                      <LinearProgress variant="determinate" value={q.total ? (q.allocated / q.total) * 100 : 0}
                        sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: QUOTA_COLORS[q.quota] } }} />
                      <Typography variant="caption" sx={{ width: 80, textAlign: 'right' }} color="text.secondary">
                        {q.allocated}/{q.total} ({q.remaining} left)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Status breakdown pie */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Applicant Status Breakdown</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.statusBreakdown.filter((s: any) => s.count > 0)} dataKey="count" nameKey="status"
                      cx="50%" cy="50%" outerRadius={80} label={({ status, count }) => `${status}: ${count}`}>
                      {data.statusBreakdown.map((_: any, i: number) => (
                        <Cell key={i} fill={['#90CAF9', '#FFB74D', '#E8571A', '#2E7D32', '#EF9A9A'][i % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Program-wise table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Program-wise Admission Status</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Program</TableCell>
                      <TableCell align="center">Total Intake</TableCell>
                      <TableCell align="center">Admitted</TableCell>
                      <TableCell align="center">Remaining</TableCell>
                      <TableCell sx={{ minWidth: 180 }}>Fill Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.programWise.map((p: any) => {
                      const rate = p.intake ? Math.round((p.admitted / p.intake) * 100) : 0;
                      return (
                        <TableRow key={p.program} hover>
                          <TableCell><Typography fontWeight={600} fontSize={13}>{p.program}</Typography></TableCell>
                          <TableCell align="center">{p.intake}</TableCell>
                          <TableCell align="center">
                            <Chip label={p.admitted} size="small" color="success" variant="outlined" />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={p.intake - p.admitted} size="small"
                              color={p.intake - p.admitted === 0 ? 'error' : 'default'} variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress variant="determinate" value={rate}
                                sx={{ flex: 1, height: 8, borderRadius: 4 }} color={rate > 80 ? 'error' : rate > 50 ? 'warning' : 'primary'} />
                              <Typography variant="caption" fontWeight={700}>{rate}%</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppShell>
  );
}
