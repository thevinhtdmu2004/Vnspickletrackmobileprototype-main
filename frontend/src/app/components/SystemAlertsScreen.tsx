import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminExperienceOperations, getAdminSystemAlerts } from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';

export function SystemAlertsScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<AdminExperienceOperations['alerts']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    getAdminSystemAlerts().then(setRows)
      .catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể tải cảnh báo.'))
      .finally(() => setLoading(false));
  }, []);
  return <div className="flex h-screen flex-col bg-[#F4F7F7]">
    <AppScreenHeader title="Cảnh báo hệ thống" eyebrow="ADMIN · TRUNG TÂM THÔNG BÁO" onBack={onBack} variant="hero" />
    <main className="flex-1 space-y-3 overflow-y-auto px-4 pb-24 pt-4">
      {loading && <div className="flex h-48 items-center justify-center"><LoaderCircle className="animate-spin text-[#075B5A]" /></div>}
      {rows.map((item, index) => <article key={`${item.type}-${index}`} className={`rounded-2xl p-4 ${item.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}><div className="flex gap-3"><AlertTriangle className="h-5 w-5 shrink-0" /><div><p className="text-xs font-black">{item.title}</p><p className="mt-1 text-[10px] opacity-75">{item.detail}</p></div></div></article>)}
      {!loading && !error && rows.length === 0 && <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center text-xs text-emerald-700">Hệ thống ổn định, không có cảnh báo ưu tiên.</div>}
      {error && <p className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600">{error}</p>}
    </main>
  </div>;
}
