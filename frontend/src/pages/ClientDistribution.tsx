import { useEffect, useState } from 'react';
import { Users, TrendingUp, Download, RefreshCw, Award, ArrowUpDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import EquiFilterBar from '../components/EquiFilterBar';

const API = import.meta.env.VITE_API_URL || 'https://ticket-analysis-api.vercel.app';
const COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#6366f1','#f97316','#14b8a6','#a855f7','#fb923c','#4ade80'];

interface Props { theme: string }

export default function ClientDistributionPage({ theme: _theme }: Props) {
  const [data, setData]               = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [sortAsc, setSortAsc]         = useState(false);

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
    fetch(`${API}/api/client-analysis${buildParams(start, end, client)}`)
      .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(d => { setData(d.data || []); setTotalTickets(d.total_tickets || 0); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleExportCSV = () => {
    const rows = filteredData.map((item, i) => [i+1, item.Client, item['Tickets Raised'], ((item['Tickets Raised']/totalTickets)*100).toFixed(2)+'%'].join(','));
    const csv = 'data:text/csv;charset=utf-8,' + encodeURI(['Rank,Client,Tickets Raised,Share %', ...rows].join('\n'));
    const a = document.createElement('a'); a.href = csv; a.download = 'client_distribution.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const filteredData = data
    .filter(item => item.Client.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? a['Tickets Raised'] - b['Tickets Raised'] : b['Tickets Raised'] - a['Tickets Raised']);

  const mostActive = data.length > 0 ? data[0] : null;
  const pieData    = data.slice(0,10).map(item => ({ name: item.Client, value: item['Tickets Raised'] }));

  if (loading && data.length === 0) return (
    <div className="page-content mobile-top-pad">
      <div className="skeleton" style={{ width:340, height:40, borderRadius:8, marginBottom:8 }}/>
      <div className="grid-kpi">{[0,1,2].map(i => <div key={i} className="skeleton" style={{ height:130, borderRadius:16 }}/>)}</div>
      <div className="grid-2col">{[0,1].map(i => <div key={i} className="skeleton" style={{ height:340, borderRadius:14 }}/>)}</div>
    </div>
  );

  if (error) return (
    <div className="page-content mobile-top-pad">
      <div style={{ display:'flex', gap:10, padding:'14px 18px', borderRadius:10, background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', color:'#f87171', fontSize:14 }}>
        Backend error: {error}
      </div>
    </div>
  );

  return (
    <div className="page-content mobile-top-pad eq-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize:32, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', lineHeight:1.1 }}>
            Client{' '}
            <span style={{ background:'linear-gradient(135deg,#e8931e,#f5b042)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Distribution</span>
          </h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', marginTop:6 }}>Activity distribution across your client portfolio</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <EquiFilterBar
            startDate={startDate}
            endDate={endDate}
            clientName={clientName}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            loading={loading}
          />
          <button onClick={() => fetchData()} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:9, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', cursor:'pointer', fontSize:13, fontWeight:600 }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}/> Refresh
          </button>
          <button onClick={handleExportCSV} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:9, border:'1px solid rgba(232,147,30,0.3)', background:'linear-gradient(135deg,#e8931e,#f5b042)', color:'#000', cursor:'pointer', fontSize:13, fontWeight:700 }}>
            <Download size={14}/> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-kpi">
        <div className="eq-kpi" style={{ background:'linear-gradient(135deg,#1e3a8a,#3b82f6)', boxShadow:'0 8px 32px rgba(59,130,246,0.25)' }}>
          <div className="eq-kpi-icon"><Users size={18} color="#fff"/></div>
          <div className="eq-kpi-value">{data.length}</div>
          <div className="eq-kpi-label">Total Clients</div>
        </div>
        <div className="eq-kpi" style={{ background:'linear-gradient(135deg,#581c87,#8b5cf6)', boxShadow:'0 8px 32px rgba(139,92,246,0.25)' }}>
          <div className="eq-kpi-icon"><Award size={18} color="#fff"/></div>
          <div className="eq-kpi-value" style={{ fontSize:20 }} title={mostActive?.Client}>{mostActive?.Client?.split(' ').slice(0,2).join(' ') || '—'}</div>
          <div className="eq-kpi-label">Most Active — {mostActive?.['Tickets Raised']||0} tickets</div>
        </div>
        <div className="eq-kpi" style={{ background:'linear-gradient(135deg,#831843,#ec4899)', boxShadow:'0 8px 32px rgba(236,72,153,0.25)' }}>
          <div className="eq-kpi-icon"><TrendingUp size={18} color="#fff"/></div>
          <div className="eq-kpi-value">{totalTickets.toLocaleString()}</div>
          <div className="eq-kpi-label">Total Tickets Raised</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2col">
        {/* Donut */}
        <div className="eq-card">
          <div className="eq-card-title">Top 10 Client Ticket Share</div>
          <div className="eq-card-sub">Volume contribution by percentage</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${(name||'').slice(0,10)}: ${((percent||0)*100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'#0d1323', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rankings */}
        <div className="eq-card" style={{ display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div>
              <div className="eq-card-title">Client Rankings</div>
              <div className="eq-card-sub" style={{ marginBottom:0 }}>Sorted by ticket volume</div>
            </div>
            <button onClick={() => setSortAsc(!sortAsc)} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-muted)', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              <ArrowUpDown size={12}/> Sort
            </button>
          </div>
          <input type="text" placeholder="Filter clients…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:9, padding:'9px 13px', fontSize:13.5, color:'var(--text-primary)', outline:'none', marginBottom:12 }}/>
          <div className="eq-table-wrap" style={{ flex:1, maxHeight:260, overflowY:'auto' }}>
            <table>
              <thead><tr><th style={{ width:55 }}>Rank</th><th>Client</th><th style={{ textAlign:'right' }}>Tickets</th><th style={{ textAlign:'right' }}>Share</th></tr></thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.Client}>
                    <td style={{ fontWeight:700, color:'var(--text-muted)' }}>#{index+1}</td>
                    <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{item.Client}</td>
                    <td style={{ textAlign:'right', fontWeight:800, color:'#f5b042' }}>{item['Tickets Raised']}</td>
                    <td style={{ textAlign:'right', color:'var(--text-muted)' }}>{((item['Tickets Raised']/totalTickets)*100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
