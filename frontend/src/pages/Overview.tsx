import { useEffect, useState } from 'react';
import { Ticket, Tag, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import EquiFilterBar from '../components/EquiFilterBar';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
const COLORS = ['#e8931e','#3b82f6','#10b981','#8b5cf6','#f43f5e','#06b6d4','#f59e0b','#84cc16','#ec4899','#14b8a6','#6366f1','#fb923c'];

interface Props { theme: string }

export default function OverviewPage({ theme: _theme }: Props) {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [clientName, setClientName] = useState('All');

  const buildParams = (start: string, end: string, client: string) => {
    const p = new URLSearchParams();
    if (start) p.set('start_date', start);
    if (end) p.set('end_date', end);
    if (client && client !== 'All') p.set('client_name', client);
    return p.toString() ? `?${p}` : '';
  };

  const fetchData = (start = startDate, end = endDate, client = clientName) => {
    setLoading(true);
    fetch(`${API}/api/full-analysis${buildParams(start, end, client)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const handleApplyFilters = (start: string, end: string, client: string) => {
    setStartDate(start);
    setEndDate(end);
    setClientName(client);
    fetchData(start, end, client);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setClientName('All');
    fetchData('', '', 'All');
  };

  const total           = data?.total_tickets ?? 0;
  const categoriesCount = data?.category_analysis?.total_categories ?? 0;
  const clientsCount    = data?.client_analysis?.total_clients ?? 0;
  const categories      = data?.category_analysis?.data ?? [];
  const clients         = data?.client_analysis?.data ?? [];

  // Top category name from data
  const topCategoryName = categories[0]?.[ 'Issue Category' ] || '—';

  const KPI = [
    { label: 'TOTAL TICKETS',     value: total,             icon: Ticket,     grad: 'linear-gradient(135deg,#0e7490,#0891b2)', glow: 'rgba(8,145,178,0.28)' },
    { label: 'ISSUE CATEGORIES',  value: categoriesCount,   icon: Tag,        grad: 'linear-gradient(135deg,#5b21b6,#7c3aed)', glow: 'rgba(124,58,237,0.28)' },
    { label: 'UNIQUE CLIENTS',    value: clientsCount,      icon: Users,      grad: 'linear-gradient(135deg,#065f46,#10b981)', glow: 'rgba(16,185,129,0.28)' },
    { label: 'TOP CATEGORY',      value: topCategoryName,   icon: TrendingUp, grad: 'linear-gradient(135deg,#92400e,#e8931e)', glow: 'rgba(232,147,30,0.28)', isText: true },
  ];

  if (loading && !data) return (
    <div className="page-content mobile-top-pad">
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div className="skeleton" style={{ width:380, height:40, borderRadius:8 }}/>
        <div className="skeleton" style={{ width:280, height:18, borderRadius:6 }}/>
      </div>
      <div className="grid-kpi" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))' }}>
        {[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height:130, borderRadius:16 }}/>)}
      </div>
      <div className="grid-2col">{[0,1].map(i => <div key={i} className="skeleton" style={{ height:290, borderRadius:14 }}/>)}</div>
      <div className="skeleton" style={{ height:300, borderRadius:14 }}/>
    </div>
  );

  if (error) return (
    <div className="page-content mobile-top-pad">
      <div style={{ display:'flex', gap:10, padding:'14px 18px', borderRadius:10, background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', color:'#f87171', fontSize:14 }}>
        Backend error: {error} — Is the API running on {API}?
      </div>
    </div>
  );

  return (
    <div className="page-content mobile-top-pad eq-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize:32, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', lineHeight:1.1 }}>
            Ticket Analysis{' '}
            <span style={{ background:'linear-gradient(135deg,#e8931e,#f5b042)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Overview</span>
          </h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', marginTop:6 }}>Real-time insights from EquiTickets support data</p>
        </div>
        <EquiFilterBar
          startDate={startDate}
          endDate={endDate}
          clientName={clientName}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          loading={loading}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid-kpi" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))' }}>
        {KPI.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="eq-kpi" style={{
              background: k.grad,
              boxShadow: `0 8px 32px ${k.glow}`,
              animationDelay: `${i*60}ms`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              borderRadius: '16px',
              minHeight: '135px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div style={{
                  fontSize: k.isText ? '19px' : '34px',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  wordBreak: 'break-word',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {typeof k.value === 'number' ? k.value.toLocaleString() : k.value}
                </div>
                <div className="eq-kpi-icon" style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px' }}>
                  <Icon size={18} color="#fff"/>
                </div>
              </div>
              <div className="eq-kpi-label" style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '12px'
              }}>
                {k.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid-2col">
        <div className="eq-card">
          <div className="eq-card-title">Top Categories by Volume</div>
          <div className="eq-card-sub">Ticket count per issue category</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categories.slice(0,8)} layout="vertical" margin={{ left:8, right:20 }}>
              <XAxis type="number" tick={{ fill:'#4e5f80', fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="Issue Category" tick={{ fill:'#8892b0', fontSize:12 }} width={155} axisLine={false} tickLine={false}
                tickFormatter={(v:string) => v.length>22 ? v.slice(0,21)+'…' : v}/>
              <Tooltip contentStyle={{ background:'#0d1323', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }} cursor={{ fill:'rgba(255,255,255,0.04)' }}/>
              <Bar dataKey="Count" radius={[0,6,6,0]}>
                {categories.slice(0,8).map((_:any,idx:number) => <Cell key={idx} fill={COLORS[idx%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="eq-card">
          <div className="eq-card-title">Top Clients by Ticket Volume</div>
          <div className="eq-card-sub">Clients raising the most support tickets</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={clients.slice(0,8)} layout="vertical" margin={{ left:8, right:20 }}>
              <XAxis type="number" tick={{ fill:'#4e5f80', fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="Client" tick={{ fill:'#8892b0', fontSize:12 }} width={145} axisLine={false} tickLine={false}
                tickFormatter={(v:string) => v.length>20 ? v.slice(0,19)+'…' : v}/>
              <Tooltip contentStyle={{ background:'#0d1323', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }} cursor={{ fill:'rgba(255,255,255,0.04)' }}/>
              <Bar dataKey="Tickets Raised" radius={[0,6,6,0]}>
                {clients.slice(0,8).map((_:any,idx:number) => <Cell key={idx} fill={COLORS[(idx+4)%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut + Legend */}
      <div className="eq-card">
        <div className="eq-card-title">Category Distribution</div>
        <div className="eq-card-sub">Proportional breakdown across all issue types</div>
        <div style={{ display:'flex', alignItems:'center', gap:32, flexWrap:'wrap' }}>
          <ResponsiveContainer width={260} height={240}>
            <PieChart>
              <Pie data={categories.slice(0,12)} dataKey="Count" nameKey="Issue Category" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                {categories.slice(0,12).map((_:any,i:number) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'#0d1323', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'8px 20px' }}>
            {categories.slice(0,12).map((c:any, i:number) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'5px 0' }}>
                <div className="eq-dot" style={{ background:COLORS[i%COLORS.length] }}/>
                <span style={{ fontSize:13, color:'var(--text-secondary)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c['Issue Category']}</span>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>{c.Count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
