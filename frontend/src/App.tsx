import { useState, useEffect } from 'react';
import { Menu, LayoutDashboard, Tag, Users, Table2, Sun, Moon, X, ChevronRight, Activity } from 'lucide-react';
import OverviewPage from './pages/Overview';
import CategoryPage from './pages/CategoryAnalysis';
import ClientPage from './pages/ClientDistribution';
import TicketsPage from './pages/RawTickets';
import './index.css';

type Page = 'overview' | 'category' | 'client' | 'tickets';
type Theme = 'dark' | 'light';

const NAV = [
  { id: 'overview' as Page, label: 'Overview',            icon: LayoutDashboard },
  { id: 'category' as Page, label: 'Category Analysis',   icon: Tag },
  { id: 'client'   as Page, label: 'Client Distribution', icon: Users },
  { id: 'tickets'  as Page, label: 'Ticket Explorer',     icon: Table2 },
];

const GOLD       = '#e8931e';
const GOLD_LIGHT = '#f5b042';
const GOLD_DIM   = 'rgba(232,147,30,0.18)';

function useIsMobile(bp = 768) {
  const [m, setM] = useState(window.innerWidth <= bp);
  useEffect(() => {
    const fn = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return m;
}

function EquitecGlobe({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="45" fill="url(#globeGradApp)" />
      <path d="M50 5 A45 45 0 0 0 50 95" stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" fill="none" />
      <path d="M50 5 A22 45 0 0 0 50 95" stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" fill="none" />
      <path d="M50 5 A22 45 0 0 1 50 95" stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" fill="none" />
      <path d="M5 50 A45 45 0 0 0 95 50" stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" fill="none" />
      <path d="M10 27 Q50 36 90 27" stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" fill="none" />
      <path d="M10 73 Q50 64 90 73" stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" fill="none" />
      <path d="M30 70 L70 30" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      <path d="M48 30 H70 V52" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="globeGradApp" x1="5" y1="5" x2="95" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5b042" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function App() {
  const [page, setPage]           = useState<Page>('overview');
  const [theme, setTheme]         = useState<Theme>('dark');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const sidebarWidth = isMobile ? 0 : collapsed ? 72 : 240;

  const dark = theme === 'dark';

  return (
    <div data-theme={theme} style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>

      {/* ── Global Background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', background: 'var(--bg-primary)' }}>
        <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'50vw', height:'50vh', background:'radial-gradient(circle, rgba(232,147,30,0.05) 0%, transparent 70%)', filter:'blur(80px)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'60vw', height:'60vh', background:'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', filter:'blur(100px)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity: dark ? 1 : 0.2 }} />
        <svg style={{ position:'absolute', bottom:0, right:0, width:'100%', height:'100%', opacity: dark ? 0.85 : 0.2, transition:'opacity 0.3s ease' }} viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg1" x1="0" y1="350" x2="0" y2="850" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#091b3f" stopOpacity="0"/><stop offset="0.5" stopColor="#081530" stopOpacity="0.6"/><stop offset="1" stopColor="#070b17" stopOpacity="0.98"/>
            </linearGradient>
            <linearGradient id="wg2" x1="0" y1="300" x2="0" y2="850" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#102e6b" stopOpacity="0"/><stop offset="0.6" stopColor="#0c1d45" stopOpacity="0.7"/><stop offset="1" stopColor="#070b17" stopOpacity="0.99"/>
            </linearGradient>
            <linearGradient id="wg3" x1="0" y1="450" x2="0" y2="850" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1a479c" stopOpacity="0"/><stop offset="0.5" stopColor="#112d69" stopOpacity="0.85"/><stop offset="1" stopColor="#070b17" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="gg2" x1="0" y1="800" x2="1440" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#c47a10" stopOpacity="0.15"/><stop offset="0.4" stopColor="#e8931e" stopOpacity="0.85"/><stop offset="1" stopColor="#ffd700" stopOpacity="1"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path d="M -100 850 C 300 700, 600 500, 950 620 C 1200 700, 1350 550, 1600 450 L 1600 850 L -100 850 Z" fill="url(#wg1)"/>
          <path d="M -100 850 C 250 600, 700 680, 1050 540 C 1250 450, 1400 500, 1600 380 L 1600 850 L -100 850 Z" fill="url(#wg2)"/>
          <path d="M -100 850 C 400 750, 750 580, 1100 640 C 1300 680, 1450 590, 1600 500 L 1600 850 L -100 850 Z" fill="url(#wg3)"/>
          <path d="M -100 660 C 250 590, 700 670, 1050 530 C 1250 440, 1400 490, 1600 370" stroke="url(#gg2)" strokeWidth="12" fill="none" filter="url(#glow)" opacity="0.35"/>
          <path d="M -100 660 C 250 590, 700 670, 1050 530 C 1250 440, 1400 490, 1600 370" stroke="url(#gg2)" strokeWidth="4" fill="none" filter="url(#glow)" opacity="0.75"/>
          <path d="M -100 660 C 250 590, 700 670, 1050 530 C 1250 440, 1400 490, 1600 370" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.9"/>
          <path d="M -100 740 C 400 640, 750 570, 1100 630 C 1300 670, 1450 580, 1600 490" stroke="url(#gg2)" strokeWidth="8" fill="none" filter="url(#glow)" opacity="0.25"/>
          <path d="M -100 740 C 400 640, 750 570, 1100 630 C 1300 670, 1450 580, 1600 490" stroke="url(#gg2)" strokeWidth="2.5" fill="none" opacity="0.8"/>
          <g>
            <circle cx="150" cy="620" r="1.5" fill="#ffd700" opacity="0.6"/><circle cx="210" cy="600" r="2.2" fill="#ffd700" opacity="0.7"/>
            <circle cx="280" cy="610" r="1.8" fill="#fff" opacity="0.9"/><circle cx="450" cy="625" r="2" fill="#ffd700" opacity="0.8"/>
            <circle cx="510" cy="615" r="2.5" fill="#f5b042" opacity="0.85"/><circle cx="720" cy="610" r="1.8" fill="#ffd700" opacity="0.75"/>
            <circle cx="750" cy="580" r="2.2" fill="#fff" opacity="0.85"/><circle cx="840" cy="585" r="2.5" fill="#fff" opacity="0.9"/>
            <circle cx="980" cy="550" r="1.2" fill="#ffd700" opacity="0.6"/><circle cx="1040" cy="535" r="1.5" fill="#fff" opacity="0.9"/>
            <circle cx="1070" cy="505" r="2.5" fill="#ffd700" opacity="0.75"/><circle cx="1250" cy="430" r="2.2" fill="#ffd700" opacity="0.8"/>
            <circle cx="1350" cy="410" r="2.5" fill="#fff" opacity="0.95"/>
            <path d="M 200 580 Q 200 585 205 585 Q 200 585 200 590 Q 200 585 195 585 Q 200 585 200 580 Z" fill="#fff" opacity="0.95"/>
            <path d="M 790 560 Q 790 565 795 565 Q 790 565 790 570 Q 790 565 785 565 Q 790 565 790 560 Z" fill="#fff" opacity="0.95"/>
            <path d="M 1080 490 Q 1080 496 1086 496 Q 1080 496 1080 502 Q 1080 496 1074 496 Q 1080 496 1080 490 Z" fill="#ffd700" opacity="0.95"/>
          </g>
        </svg>
      </div>

      {/* Mobile hamburger */}
      {isMobile && (
        <button className="mobile-hamburger" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
      )}
      {isMobile && (
        <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <div className={isMobile ? `sidebar-mobile ${mobileOpen ? 'sidebar-open' : ''}` : ''} style={{ position: 'relative', zIndex: 10 }}>
        <aside style={{
          width: collapsed ? 72 : 240,
          minHeight: '100vh',
          background: dark ? 'linear-gradient(180deg,#0c1020 0%,#070b17 100%)' : 'linear-gradient(180deg,#111827 0%,#0c1020 100%)',
          borderRight: '1px solid rgba(232,147,30,0.12)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          overflow: 'hidden',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}>
          {/* Right edge glow */}
          <div style={{ position:'absolute', top:'15%', right:0, width:1, height:'70%', background:'linear-gradient(180deg, transparent, rgba(232,147,30,0.35), transparent)', pointerEvents:'none', zIndex:1 }} />

          {/* ── Logo ── */}
          <div style={{ padding: collapsed ? '20px 0' : '22px 18px 18px', display:'flex', alignItems:'center', gap:11, borderBottom:'1px solid rgba(255,255,255,0.05)', minHeight:80, justifyContent: collapsed ? 'center' : 'flex-start', position:'relative', zIndex:3 }}>
            {collapsed ? (
              <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(232,147,30,0.06)', border:'1px solid rgba(232,147,30,0.2)', boxShadow:'0 0 15px rgba(232,147,30,0.15)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s ease' }}>
                <EquitecGlobe size={26} />
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
                <div style={{ display:'flex', alignItems:'baseline', fontFamily:'"Outfit","Inter","Segoe UI",sans-serif', color:'#ffffff', lineHeight:1, letterSpacing:'-0.5px' }}>
                  <span style={{ fontSize:25, fontWeight:800 }}>equ</span>
                  <span style={{ position:'relative', display:'inline-flex', alignItems:'baseline', fontSize:25, fontWeight:800 }}>
                    <span style={{ position:'absolute', top:-11, left:-2.5, width:12.5, height:12.5, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <EquitecGlobe size={12} />
                    </span>
                    <span>i</span>
                  </span>
                  <span style={{ fontSize:25, fontWeight:800 }}>tec</span>
                  <span style={{ margin:'0 6px', fontWeight:300, opacity:0.45, fontSize:13 }}>x</span>
                  <span style={{ fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.85)' }}>EquiTickets</span>
                </div>
                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:10, fontWeight:700, letterSpacing:'1px', marginTop:4, textTransform:'uppercase', fontFamily:'"Inter",sans-serif', lineHeight:1 }}>SOFTWARE</div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:8.5, fontWeight:600, letterSpacing:'0.4px', textTransform:'uppercase', fontFamily:'"Inter",sans-serif', marginTop:2, lineHeight:1 }}>TECHNOLOGY PVT. LTD.</div>
              </div>
            )}
          </div>

          {/* ── Nav ── */}
          <nav style={{ flex:1, padding:'14px 8px', display:'flex', flexDirection:'column', gap:3 }}>
            {NAV.map(({ id, label, icon: Icon }) => {
              const active = page === id;
              return (
                <button key={id} onClick={() => { setPage(id); if (isMobile) setMobileOpen(false); }}
                  title={collapsed ? label : undefined}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(232,147,30,0.07)'; (e.currentTarget as HTMLElement).style.color = GOLD_LIGHT; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#8892b0'; } }}
                  style={{ display:'flex', alignItems:'center', gap:12, padding: collapsed ? '12px 0' : '11px 14px', borderRadius:10, border: active ? '1px solid rgba(232,147,30,0.2)' : '1px solid transparent', cursor:'pointer', width:'100%', background: active ? GOLD_DIM : 'transparent', color: active ? GOLD_LIGHT : '#8892b0', textAlign:'left', transition:'all 0.2s ease', position:'relative', justifyContent: collapsed ? 'center' : 'flex-start', boxShadow: active ? '0 2px 12px rgba(232,147,30,0.12)' : 'none' }}>
                  {active && <div style={{ position:'absolute', left:0, top:'18%', bottom:'18%', width:3, background:`linear-gradient(180deg,${GOLD},${GOLD_LIGHT})`, borderRadius:'0 4px 4px 0', boxShadow:`0 0 8px ${GOLD}80` }} />}
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ flexShrink:0 }} />
                  {!collapsed && <span style={{ fontSize:13.5, fontWeight: active ? 700 : 400, flex:1, letterSpacing:'-0.1px' }}>{label}</span>}
                  {!collapsed && active && <ChevronRight size={14} style={{ opacity:0.7 }} />}
                </button>
              );
            })}

            {/* WorkPulse External Link */}
            <button
              onClick={() => window.open('https://work-pulse-frontend.vercel.app/', '_blank')}
              title={collapsed ? "WorkPulse" : undefined}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(56, 189, 248, 0.14)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(56, 189, 248, 0.45)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(56, 189, 248, 0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(56, 189, 248, 0.2)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px 0' : '11px 14px',
                borderRadius: 10,
                border: '1px solid rgba(56, 189, 248, 0.2)',
                cursor: 'pointer',
                width: '100%',
                background: 'rgba(56, 189, 248, 0.06)',
                color: '#38bdf8',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
                justifyContent: collapsed ? 'center' : 'flex-start',
                marginTop: '12px',
                fontWeight: 700,
              }}
            >
              <Activity size={18} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13.5, flex: 1, letterSpacing: '-0.1px' }}>WorkPulse</span>}
              {!collapsed && <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 500 }}>↗</span>}
            </button>
          </nav>

          {/* ── Sidebar wave graphic ── */}
          <div style={{ position:'relative', width:'100%', height: collapsed ? 80 : 160, marginTop:'auto', marginBottom:10, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
            <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" preserveAspectRatio="xMidYMid meet" style={{ opacity:0.95 }}>
              <defs>
                <linearGradient id="swg1" x1="0" y1="80" x2="0" y2="165" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#091b3f" stopOpacity="0"/><stop offset="0.5" stopColor="#081530" stopOpacity="0.75"/><stop offset="1" stopColor="#070b17" stopOpacity="0.99"/>
                </linearGradient>
                <linearGradient id="swg2" x1="0" y1="70" x2="0" y2="165" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#102e6b" stopOpacity="0"/><stop offset="0.6" stopColor="#0c1d45" stopOpacity="0.8"/><stop offset="1" stopColor="#070b17" stopOpacity="0.99"/>
                </linearGradient>
                <linearGradient id="swg3" x1="0" y1="90" x2="0" y2="165" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#1a479c" stopOpacity="0"/><stop offset="0.5" stopColor="#112d69" stopOpacity="0.9"/><stop offset="1" stopColor="#070b17" stopOpacity="1"/>
                </linearGradient>
                <linearGradient id="sgg" x1="0" y1="160" x2="240" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#c47a10" stopOpacity="0.15"/><stop offset="0.5" stopColor="#e8931e" stopOpacity="0.85"/><stop offset="1" stopColor="#ffd700" stopOpacity="1"/>
                </linearGradient>
                <filter id="sg"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M -20 170 Q 60 110 130 135 T 260 100 L 260 170 L -20 170 Z" fill="url(#swg1)"/>
              <path d="M -20 170 Q 70 80 140 110 T 260 90 L 260 170 L -20 170 Z" fill="url(#swg2)"/>
              <path d="M -20 170 Q 80 120 150 100 T 260 110 L 260 170 L -20 170 Z" fill="url(#swg3)"/>
              <path d="M -20 120 Q 70 80 140 110 T 260 90" stroke="url(#sgg)" strokeWidth="7" fill="none" filter="url(#sg)" opacity="0.3"/>
              <path d="M -20 120 Q 70 80 140 110 T 260 90" stroke="url(#sgg)" strokeWidth="2.5" fill="none" filter="url(#sg)" opacity="0.75"/>
              <path d="M -20 120 Q 70 80 140 110 T 260 90" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.9"/>
              <g>
                <circle cx="50" cy="95" r="1.2" fill="#fff" opacity="0.8"/>
                <circle cx="95" cy="85" r="1.5" fill="#ffd700" opacity="0.9"/>
                <circle cx="130" cy="90" r="1" fill="#ffd700" opacity="0.85"/>
                <circle cx="185" cy="80" r="1.4" fill="#ffd700" opacity="0.9"/>
                <path d="M 60 90 Q 60 92.5 62.5 92.5 Q 60 92.5 60 95 Q 60 92.5 57.5 92.5 Q 60 92.5 60 90 Z" fill="#fff" opacity="0.95"/>
                <path d="M 145 95 Q 145 97 147 97 Q 145 97 145 99 Q 145 97 143 97 Q 145 97 145 95 Z" fill="#ffd700" opacity="0.9"/>
                <path d="M 200 85 Q 200 87.5 202.5 87.5 Q 200 87.5 200 90 Q 200 87.5 197.5 87.5 Q 200 87.5 200 85 Z" fill="#fff" opacity="0.95"/>
              </g>
            </svg>
          </div>

          {/* ── Bottom Controls ── */}
          <div style={{ padding:'10px 8px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', gap:4, position:'relative', zIndex:2 }}>
            <button onClick={() => setTheme(dark ? 'light' : 'dark')}
              title={collapsed ? (dark ? 'Light Mode' : 'Dark Mode') : undefined}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,147,30,0.07)'; (e.currentTarget as HTMLElement).style.color = GOLD_LIGHT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = '#8892b0'; }}
              style={{ display:'flex', alignItems:'center', gap:12, padding: collapsed ? '10px 0' : '10px 14px', borderRadius:10, border:'1px solid transparent', cursor:'pointer', background:'rgba(255,255,255,0.03)', color:'#8892b0', width:'100%', justifyContent: collapsed ? 'center' : 'flex-start', transition:'all 0.2s' }}>
              {dark ? <Sun size={16}/> : <Moon size={16}/>}
              {!collapsed && <span style={{ fontSize:13, fontWeight:400 }}>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button onClick={() => setCollapsed(!collapsed)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#8892b0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4e5f80'; }}
              style={{ display:'flex', alignItems:'center', gap:12, padding: collapsed ? '10px 0' : '10px 14px', borderRadius:10, border:'1px solid transparent', cursor:'pointer', background:'transparent', color:'#4e5f80', width:'100%', justifyContent: collapsed ? 'center' : 'flex-start', transition:'all 0.2s' }}>
              {collapsed ? <Menu size={16}/> : <X size={16}/>}
              {!collapsed && <span style={{ fontSize:13 }}>Collapse</span>}
            </button>
          </div>
        </aside>
      </div>

      {/* ── Main Content ── */}
      <main className={isMobile ? 'main-content-mobile' : ''} style={{ marginLeft: sidebarWidth, flex:1, minHeight:'100vh', transition:'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)', overflow:'auto', position:'relative', zIndex:1 }}>
        {page === 'overview'  && <OverviewPage  theme={theme} />}
        {page === 'category'  && <CategoryPage  theme={theme} />}
        {page === 'client'    && <ClientPage    theme={theme} />}
        {page === 'tickets'   && <TicketsPage   theme={theme} />}
      </main>
    </div>
  );
}
