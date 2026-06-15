import { useEffect, useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import EquiFilterBar from '../components/EquiFilterBar';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
const PER_PAGE = 20;

interface Props { theme: string }

export default function RawTicketsPage({ theme: _theme }: Props) {
  const [allData, setAllData]         = useState<any[]>([]);
  const [filtered, setFiltered]       = useState<any[]>([]);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [error, setError]             = useState('');

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

  const fetchData = async (start = startDate, end = endDate, client = clientName) => {
    setLoading(true);
    try {
      const params = buildParams(start, end, client);
      const catRes  = await fetch(`${API}/api/category-analysis${params}`).then(r => r.json());
      const cats    = catRes.data || [];
      const results = await Promise.all(
        cats.map((cat: any) =>
          fetch(`${API}/api/tickets-by-category/${encodeURIComponent(cat['Issue Category'])}${params}`)
            .then(r => r.json())
            .then(r => (r.data || []).map((t: any) => ({ ...t, Category: cat['Issue Category'] })))
            .catch(() => [])
        )
      );
      const all = results.flat().sort((a, b) => (a.No || 0) - (b.No || 0));
      setAllData(all);
      setFiltered(all);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
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

  useEffect(() => {
    if (!search.trim()) { setFiltered(allData); setPage(1); return; }
    const q = search.toLowerCase();
    setFiltered(allData.filter(t =>
      (t.Client||'').toLowerCase().includes(q) ||
      (t.Subject||'').toLowerCase().includes(q) ||
      (t['Raised By']||'').toLowerCase().includes(q) ||
      (t.Status||'').toLowerCase().includes(q) ||
      (t.Category||'').toLowerCase().includes(q)
    ));
    setPage(1);
  }, [search, allData]);

  const handleExportCSV = () => {
    const header = 'No,Client,Subject,Category,Raised By,Raised Date,Status,Days';
    const rows   = filtered.map(t => [
      t.No||'', t.Client||'', `"${(t.Subject||'').replace(/"/g,'""')}"`,
      t.Category||'', t['Raised By']||'', t['Raised Date']||t['Raised date']||'',
      t.Status||'', t.Days||''
    ].join(','));
    const uri = encodeURI('data:text/csv;charset=utf-8,' + [header,...rows].join('\n'));
    const a = document.createElement('a'); a.href = uri; a.download = 'tickets_export.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const startIdx   = (page - 1) * PER_PAGE;
  const pageData   = filtered.slice(startIdx, startIdx + PER_PAGE);

  if (loading && allData.length === 0) return (
    <div className="page-content mobile-top-pad">
      <div className="skeleton" style={{ width:260, height:40, borderRadius:8, marginBottom:8 }}/>
      <div className="skeleton" style={{ height:50, borderRadius:10 }}/>
      <div className="skeleton" style={{ height:450, borderRadius:14 }}/>
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
            Ticket{' '}
            <span style={{ background:'linear-gradient(135deg,#e8931e,#f5b042)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Explorer</span>
          </h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', marginTop:6 }}>Interactive registry of all {allData.length.toLocaleString()} support tickets</p>
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

      {/* Search bar */}
      <div className="eq-search">
        <Search size={15} style={{ color:'var(--text-muted)', flexShrink:0 }}/>
        <input placeholder="Search by client, subject, employee, category, status…" value={search} onChange={e => setSearch(e.target.value)}/>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', whiteSpace:'nowrap', marginLeft:8 }}>{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="eq-card" style={{ padding:0, overflow:'hidden', background:'#0c1020' }}>
        <div className="eq-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width:50 }}>No</th>
                <th>Client</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Raised By</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign:'right' }}>Days</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length > 0 ? pageData.map((ticket, i) => (
                <tr key={i}>
                  <td style={{ fontWeight:700, color:'var(--text-muted)' }}>{ticket.No}</td>
                  <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{ticket.Client||'—'}</td>
                  <td style={{ maxWidth:280, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={ticket.Subject}>{ticket.Subject||'—'}</td>
                  <td>
                    <span className="eq-badge eq-badge-gray" style={{ fontSize:11, background:'rgba(59,130,246,0.08)', color:'#60a5fa', borderColor:'rgba(59,130,246,0.18)' }}>
                      {ticket.Category ? ticket.Category.split(' ').slice(0,2).join(' ') : '—'}
                    </span>
                  </td>
                  <td style={{ whiteSpace:'nowrap' }}>{ticket['Raised By']||'—'}</td>
                  <td style={{ whiteSpace:'nowrap' }}>{ticket['Raised Date']||ticket['Raised date']||'—'}</td>
                  <td>
                    <span className={`eq-badge ${(ticket.Status||'').toLowerCase().includes('open')?'eq-badge-open':(ticket.Status||'').toLowerCase().includes('close')?'eq-badge-closed':'eq-badge-gray'}`}>
                      {ticket.Status||'—'}
                    </span>
                  </td>
                  <td style={{ textAlign:'right', fontWeight:700, color:'#f5b042' }}>{ticket.Days||'—'}</td>
                </tr>
              )) : (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)', fontSize:14 }}>No tickets match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13.5, color:'var(--text-muted)' }}>
            Showing {startIdx+1}–{Math.min(startIdx+PER_PAGE, filtered.length)} of {filtered.length} tickets
          </span>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, borderRadius:9, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', cursor: page===1 ? 'not-allowed' : 'pointer', opacity: page===1 ? 0.4 : 1 }}>
              <ChevronLeft size={15}/>
            </button>
            <span style={{ fontSize:13.5, color:'var(--text-secondary)' }}>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, borderRadius:9, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', cursor: page===totalPages ? 'not-allowed' : 'pointer', opacity: page===totalPages ? 0.4 : 1 }}>
              <ChevronRight size={15}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
