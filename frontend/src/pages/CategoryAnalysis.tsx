import { useEffect, useState } from 'react';
import { Search, Tag, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import EquiFilterBar from '../components/EquiFilterBar';

const API = import.meta.env.VITE_API_URL || 'https://ticket-analysis-api.vercel.app';
const COLORS = ['#e8931e','#3b82f6','#10b981','#8b5cf6','#f43f5e','#06b6d4','#f59e0b','#84cc16','#ec4899','#14b8a6','#6366f1','#fb923c','#a78bfa','#34d399','#60a5fa','#fbbf24'];

interface Props { theme: string }

export default function CategoryPage({ theme: _theme }: Props) {
  const [cats, setCats]           = useState<any[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<string | null>(null);
  const [tickets, setTickets]     = useState<any[]>([]);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('desc');

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
    fetch(`${API}/api/category-analysis${buildParams(start, end, client)}`)
      .then(r => r.json())
      .then(d => {
        setCats(d.data || []);
        setTotal(d.total_tickets || 0);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
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

  const filtered = cats
    .filter(c => c['Issue Category'].toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === 'desc' ? b.Count - a.Count : a.Count - b.Count);

  const handleSelect = (cat: string) => {
    if (selected === cat) { setSelected(null); setTickets([]); return; }
    setSelected(cat); setTicketLoading(true);
    const params = buildParams(startDate, endDate, clientName);
    fetch(`${API}/api/tickets-by-category/${encodeURIComponent(cat)}${params}`)
      .then(r => r.json())
      .then(d => { setTickets(d.data || []); setTicketLoading(false); })
      .catch(() => setTicketLoading(false));
  };

  const maxCount = cats.length ? Math.max(...cats.map(c => c.Count)) : 1;

  if (loading && cats.length === 0) return (
    <div className="page-content mobile-top-pad">
      <div className="skeleton" style={{ width:320, height:40, borderRadius:8, marginBottom:8 }}/>
      {[0,1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:52, borderRadius:10, marginBottom:8 }}/>)}
    </div>
  );

  if (error) return (
    <div className="page-content mobile-top-pad">
      <div style={{ display:'flex', gap:10, padding:'14px 18px', borderRadius:10, background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', color:'#f87171', fontSize:14 }}>
        <AlertTriangle size={16}/> {error}
      </div>
    </div>
  );

  return (
    <div className="page-content mobile-top-pad eq-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize:32, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', lineHeight:1.1 }}>
            Category{' '}
            <span style={{ background:'linear-gradient(135deg,#e8931e,#f5b042)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Analysis</span>
          </h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', marginTop:6 }}>{total.toLocaleString()} tickets across {cats.length} issue categories</p>
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
          <button onClick={() => setSortDir(d => d==='desc'?'asc':'desc')}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', borderRadius:9, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s' }}>
            {sortDir === 'desc' ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
            {sortDir === 'desc' ? 'Highest First' : 'Lowest First'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div className="eq-search" style={{ flex:1, minWidth:200 }}>
          <Search size={15} style={{ color:'var(--text-muted)', flexShrink:0 }}/>
          <input placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', fontSize:13, color:'var(--text-muted)' }}>
          <Tag size={13}/> {filtered.length} categories
        </div>
      </div>

      {/* Category rows / table */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {filtered.map((c) => {
          const color   = COLORS[cats.indexOf(c) % COLORS.length];
          const pct     = Math.round((c.Count / maxCount) * 100);
          const isOpen  = selected === c['Issue Category'];
          return (
            <div key={c['Issue Category']}>
              <div onClick={() => handleSelect(c['Issue Category'])}
                style={{ background: isOpen ? `${color}10` : '#0c1020', border:`1px solid ${isOpen ? color+'40' : 'rgba(45,51,84,0.8)'}`, borderRadius:12, padding:'13px 18px', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:14 }}>
                {/* Rank badge */}
                <div style={{ width:30, height:30, borderRadius:8, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color, flexShrink:0 }}>
                  {cats.indexOf(c)+1}
                </div>
                {/* Name + bar */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c['Issue Category']}</div>
                  <div className="eq-progress-track">
                    <div className="eq-progress-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}aa)` }}/>
                  </div>
                </div>
                {/* Count */}
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:22, fontWeight:900, color, lineHeight:1 }}>{c.Count}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>tickets</div>
                </div>
                {/* Pct */}
                <div style={{ width:50, textAlign:'right', fontSize:13, fontWeight:700, color:'var(--text-muted)', flexShrink:0 }}>
                  {((c.Count/total)*100).toFixed(1)}%
                </div>
                {isOpen ? <ChevronUp size={15} style={{ color:'var(--text-muted)', flexShrink:0 }}/> : <ChevronDown size={15} style={{ color:'var(--text-muted)', flexShrink:0 }}/>}
              </div>

              {/* Expanded ticket list */}
              {isOpen && (
                <div style={{ margin:'3px 0 3px 18px', background:'#0c1020', border:'1px solid rgba(45,51,84,0.8)', borderRadius:'0 0 12px 12px', overflow:'hidden' }}>
                  {ticketLoading ? (
                    <div style={{ padding:16 }}>{[0,1,2].map(k => <div key={k} className="skeleton" style={{ height:38, borderRadius:6, marginBottom:6 }}/>)}</div>
                  ) : tickets.length === 0 ? (
                    <div style={{ padding:16, fontSize:14, color:'var(--text-muted)', textAlign:'center' }}>No tickets found</div>
                  ) : (
                    <div className="eq-table-wrap">
                      <table>
                        <thead><tr><th>#</th><th>Client</th><th>Subject</th><th>Raised Date</th><th>Status</th></tr></thead>
                        <tbody>
                          {tickets.slice(0,10).map((t:any, idx:number) => (
                            <tr key={idx}>
                              <td style={{ color:'var(--text-muted)', fontWeight:600 }}>{idx+1}</td>
                              <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{t.Client||'—'}</td>
                              <td style={{ maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.Subject||'—'}</td>
                              <td style={{ whiteSpace:'nowrap' }}>{t['Raised Date']||t['Raised date']||'—'}</td>
                              <td>
                                <span className={`eq-badge ${(t.Status||'').toLowerCase().includes('open')?'eq-badge-open':(t.Status||'').toLowerCase().includes('close')?'eq-badge-closed':'eq-badge-gray'}`}>
                                  {t.Status||'—'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {tickets.length > 10 && <div style={{ padding:'8px 16px', fontSize:13, color:'var(--text-muted)', borderTop:'1px solid rgba(45,51,84,0.8)' }}>+{tickets.length-10} more tickets in this category</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bar chart — moved below the table/rows */}
      <div className="eq-card" style={{ marginTop:12 }}>
        <div className="eq-card-title">All Categories — Ticket Volume Chart</div>
        <div className="eq-card-sub">Visual breakdown of issues by volume</div>
        <ResponsiveContainer width="100%" height={310}>
          <BarChart data={filtered.slice(0,12)} layout="vertical" margin={{ left:8, right:24 }}>
            <XAxis type="number" tick={{ fill:'#4e5f80', fontSize:12 }} axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="Issue Category" tick={{ fill:'#8892b0', fontSize:12 }} width={190} axisLine={false} tickLine={false}
              tickFormatter={(v:string) => v.length>26 ? v.slice(0,25)+'…' : v}/>
            <Tooltip contentStyle={{ background:'#0d1323', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }} cursor={{ fill:'rgba(255,255,255,0.04)' }}/>
            <Bar dataKey="Count" radius={[0,6,6,0]}>
              {filtered.slice(0,12).map((_:any,i:number) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
