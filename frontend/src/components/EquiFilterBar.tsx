import { useState, useEffect } from 'react';
import { Calendar, User, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://ticket-analysis-api.vercel.app';

interface Props {
  startDate: string;
  endDate: string;
  clientName: string;
  onApply: (start: string, end: string, client: string) => void;
  onClear: () => void;
  loading?: boolean;
}

export default function EquiFilterBar({
  startDate,
  endDate,
  clientName,
  onApply,
  onClear,
  loading
}: Props) {
  const [start, setStart]   = useState(startDate);
  const [end, setEnd]       = useState(endDate);
  const [client, setClient] = useState(clientName);
  const [clients, setClients] = useState<string[]>([]);

  // Sync state if props change (e.g. on clear)
  useEffect(() => {
    setStart(startDate);
    setEnd(endDate);
    setClient(clientName);
  }, [startDate, endDate, clientName]);

  // Fetch client list for dropdown
  useEffect(() => {
    fetch(`${API}/api/client-analysis`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          const list = d.data.map((item: any) => item.Client).filter(Boolean);
          setClients(list);
        }
      })
      .catch(() => {});
  }, []);

  const handleApply = () => {
    onApply(start, end, client);
  };

  const isFiltered = start !== '' || end !== '' || client !== 'All';

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '13.5px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    width: '125px',
    padding: '0 4px',
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#0c1020',
      border: '1px solid rgba(45, 51, 84, 0.8)',
      padding: '8px 16px',
      borderRadius: '12px',
      flexWrap: 'wrap',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Start Date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#131930',
        border: '1px solid #2d3354',
        borderRadius: '8px',
        padding: '6px 12px',
        minHeight: '36px'
      }}>
        <Calendar size={14} style={{ color: '#8892b0' }} />
        <input
          type="date"
          value={start}
          onChange={e => setStart(e.target.value)}
          style={inputStyle}
          disabled={loading}
        />
      </div>

      {/* to */}
      <span style={{ fontSize: '13.5px', color: '#8892b0', fontWeight: 500 }}>to</span>

      {/* End Date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#131930',
        border: '1px solid #2d3354',
        borderRadius: '8px',
        padding: '6px 12px',
        minHeight: '36px'
      }}>
        <Calendar size={14} style={{ color: '#8892b0' }} />
        <input
          type="date"
          value={end}
          onChange={e => setEnd(e.target.value)}
          style={inputStyle}
          disabled={loading}
        />
      </div>

      {/* Client Dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#131930',
        border: '1px solid #2d3354',
        borderRadius: '8px',
        padding: '6px 12px',
        minHeight: '36px',
        position: 'relative'
      }}>
        <User size={14} style={{ color: '#8892b0' }} />
        <select
          value={client}
          onChange={e => setClient(e.target.value)}
          disabled={loading}
          style={{
            ...inputStyle,
            width: '160px',
            appearance: 'none',
            WebkitAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238892b0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 2px center',
            paddingRight: '20px'
          }}
        >
          <option value="All">All Clients</option>
          {clients.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={loading}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.filter = 'none';
        }}
        style={{
          background: 'linear-gradient(135deg, #e8931e, #f5b042)',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          padding: '0 20px',
          height: '36px',
          fontSize: '13.5px',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(232, 147, 30, 0.2)'
        }}
      >
        Apply
      </button>

      {/* Clear/Reset Button */}
      {isFiltered && (
        <button
          onClick={onClear}
          title="Clear Filters"
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8892b0',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
