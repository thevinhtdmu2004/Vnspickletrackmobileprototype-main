import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Users, Clock, BarChart3, Calendar } from 'lucide-react';
import { useState } from 'react';

interface MonthlySessionReportScreenProps {
  onBack: () => void;
}

const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6'];
const MONTH_DATA = [
  { month: 'T1', total: 52, avgRate: 82, classes: 4, students: 38 },
  { month: 'T2', total: 48, avgRate: 79, classes: 4, students: 39 },
  { month: 'T3', total: 56, avgRate: 85, classes: 5, students: 41 },
  { month: 'T4', total: 60, avgRate: 88, classes: 5, students: 42 },
];

const BY_CLASS = [
  { name: 'Beginner A',     sessions: 18, rate: 90, students: 8,  color: '#2A9D8F' },
  { name: 'Intermediate B', sessions: 14, rate: 85, students: 10, color: '#F4A261' },
  { name: 'Advanced C',     sessions: 10, rate: 88, students: 6,  color: '#815AD5' },
  { name: 'Beginner B',     sessions: 12, rate: 82, students: 8,  color: '#0E7C7B' },
  { name: 'Intermediate A', sessions: 6,  rate: 75, students: 9,  color: '#E76F51' },
];

const WEEKLY = [
  { week: 'Tuần 1', sessions: 15, rate: 87 },
  { week: 'Tuần 2', sessions: 14, rate: 85 },
  { week: 'Tuần 3', sessions: 16, rate: 91 },
  { week: 'Tuần 4', sessions: 15, rate: 89 },
];

export function MonthlySessionReportScreen({ onBack }: MonthlySessionReportScreenProps) {
  const [monthIdx, setMonthIdx] = useState(3); // April

  const cur  = MONTH_DATA[monthIdx] ?? MONTH_DATA[3];
  const prev = MONTH_DATA[monthIdx - 1];
  const delta = prev ? cur.total - prev.total : 0;
  const maxSessions = Math.max(...BY_CLASS.map(c => c.sessions));
  const maxBar = Math.max(...MONTH_DATA.map(d => d.total));

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#054A49,#075E5D,#0E7C7B)' }}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:bg-white/25">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/60" style={{ fontSize: 11 }}>Báo cáo</p>
            <h1 className="text-white" style={{ fontSize: 18, fontWeight: 800 }}>Lượt học tháng</h1>
          </div>
        </div>

        {/* month nav */}
        <div className="flex items-center gap-4 px-4 pb-4">
          <button
            onClick={() => setMonthIdx(i => Math.max(0, i - 1))}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:bg-white/25"
            disabled={monthIdx === 0}
          >
            <ChevronLeft style={{ width: 16, height: 16, color: monthIdx === 0 ? 'rgba(255,255,255,0.3)' : 'white' }} />
          </button>
          <div className="flex-1 text-center">
            <p className="text-white" style={{ fontSize: 20, fontWeight: 900 }}>{MONTHS[monthIdx]}</p>
            <p className="text-white/60" style={{ fontSize: 11 }}>2026</p>
          </div>
          <button
            onClick={() => setMonthIdx(i => Math.min(MONTH_DATA.length - 1, i + 1))}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:bg-white/25"
            disabled={monthIdx >= MONTH_DATA.length - 1}
          >
            <ChevronRight style={{ width: 16, height: 16, color: monthIdx >= MONTH_DATA.length - 1 ? 'rgba(255,255,255,0.3)' : 'white' }} />
          </button>
        </div>

        {/* KPI chips */}
        <div className="grid grid-cols-4 px-4 pb-4 gap-2">
          {[
            { n: cur.total,             l: 'Tổng buổi' },
            { n: `${cur.avgRate}%`,     l: 'Chuyên cần' },
            { n: cur.classes,           l: 'Lớp hoạt động' },
            { n: delta >= 0 ? `+${delta}` : `${delta}`, l: 'So tháng trước' },
          ].map((s, i) => (
            <div key={i} className="text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: i === 3 ? 14 : 16, fontWeight: 900, color: i === 3 ? (delta >= 0 ? '#4ADE80' : '#F87171') : 'white', lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 space-y-4">

        {/* ── Monthly trend bar chart ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 style={{ width: 16, height: 16, color: '#0E7C7B' }} />
            <p style={{ fontSize: 13, fontWeight: 700 }}>Xu hướng 4 tháng</p>
          </div>
          <div className="flex items-end gap-3 h-32">
            {MONTH_DATA.map((d, i) => {
              const h = Math.round((d.total / maxBar) * 100);
              const isActive = i === monthIdx;
              return (
                <button key={d.month} onClick={() => setMonthIdx(i)} className="flex-1 flex flex-col items-center gap-1.5">
                  <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? '#0E7C7B' : '#9CA3AF' }}>{d.total}</span>
                  <div className="w-full rounded-t-lg transition-all overflow-hidden" style={{ height: h + '%', minHeight: 8, background: isActive ? 'linear-gradient(180deg,#0E7C7B,#2A9D8F)' : '#E5E7EB', boxShadow: isActive ? '0 4px 12px rgba(14,124,123,0.35)' : 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? '#0E7C7B' : '#9CA3AF' }}>{d.month}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Weekly breakdown ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar style={{ width: 16, height: 16, color: '#0E7C7B' }} />
            <p style={{ fontSize: 13, fontWeight: 700 }}>Theo tuần</p>
          </div>
          <div className="space-y-3">
            {WEEKLY.map((w, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{w.week}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{w.sessions} buổi</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0E7C7B' }}>{w.rate}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${w.rate}%`, background: `linear-gradient(90deg,#0E7C7B,#2A9D8F)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── By class ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users style={{ width: 16, height: 16, color: '#0E7C7B' }} />
            <p style={{ fontSize: 13, fontWeight: 700 }}>Theo lớp học</p>
          </div>
          <div className="space-y-3">
            {BY_CLASS.map(c => {
              const barW = Math.round((c.sessions / maxSessions) * 100);
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 11, color: '#6B7280' }}>{c.students} HV</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{c.sessions} buổi</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.rate >= 85 ? '#2A9D8F' : c.rate >= 75 ? '#E9C46A' : '#E76F51' }}>{c.rate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${barW}%`, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Summary card ── */}
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(14,124,123,0.08),rgba(42,157,143,0.04))', border: '1px solid rgba(14,124,123,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp style={{ width: 16, height: 16, color: '#0E7C7B' }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0E7C7B' }}>Nhận xét tháng {MONTHS[monthIdx]}</p>
          </div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
            Tháng {monthIdx + 1} ghi nhận <strong>{cur.total} buổi học</strong> với tỷ lệ chuyên cần đạt <strong>{cur.avgRate}%</strong> — {delta >= 0 ? `tăng ${delta} buổi` : `giảm ${Math.abs(delta)} buổi`} so với tháng trước. Lớp có tỷ lệ tốt nhất: <strong>{BY_CLASS.sort((a,b) => b.rate - a.rate)[0].name}</strong> ({BY_CLASS.sort((a,b) => b.rate - a.rate)[0].rate}%).
          </p>
        </div>
      </div>
    </div>
  );
}
