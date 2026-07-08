import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router';
import { ArrowLeft, Search, RefreshCw, CloudDownload, CheckCircle, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  customerEmail?: string;
  recipientAccount?: string;
  biller?: string;
  phone?: string;
  sessionId?: string;
}

const statusStyles: Record<string, string> = {
  success: 'bg-green-400/10 text-green-400',
  pending: 'bg-yellow-400/10 text-yellow-400',
  failed: 'bg-red-400/10 text-red-400',
  reversed: 'bg-purple-400/10 text-purple-400',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.transactions.list({ page: 1 });
      setTransactions(
        (Array.isArray(data) ? data : (data as { rows?: Transaction[] }).rows || []) as Transaction[],
      );
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function syncFromNomba() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await api.transactions.syncFromNomba({ scope: 'sub' });
      await load();
      setSyncMessage({ type: 'success', text: 'Transactions synced from Nomba successfully' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed. Check your permissions.';
      setSyncMessage({ type: 'error', text: msg });
    }
    setSyncing(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = transactions.filter((t) => {
    const q = filter.toLowerCase();
    const matchesSearch = !q || t.type?.toLowerCase().includes(q) || t.customerEmail?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <header className="border-b border-white/10 bg-[#06070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="rounded-full border border-white/15 p-2 text-white/70 hover:bg-white/10">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#dfe66a]">Payer</Link>
              <p className="text-sm text-white/60">Transaction history</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {syncMessage && (
          <div className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            syncMessage.type === 'success'
              ? 'bg-green-400/10 text-green-400'
              : 'bg-red-400/10 text-red-400'
          }`}>
            {syncMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{syncMessage.text}</span>
            <button onClick={() => setSyncMessage(null)} className="ml-auto text-white/40 hover:text-white/70">&times;</button>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white/80">Nomba transaction sync</h2>
              <p className="mt-0.5 text-xs text-white/40">
                Pull the latest transactions from your Nomba account into your local records
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={syncFromNomba}
                disabled={syncing}
                className="inline-flex items-center gap-2 rounded-full bg-[#dfe66a] px-5 py-2 text-xs font-semibold text-[#111] transition hover:bg-[#c8cf4d] disabled:opacity-50"
              >
                <CloudDownload size={14} className={syncing ? 'animate-bounce' : ''} />
                {syncing ? 'Syncing...' : 'Sync from Nomba'}
              </button>
              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search transactions"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2">
            {['', 'success', 'pending', 'failed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${statusFilter === s ? 'bg-[#dfe66a] text-[#111]' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 p-12 text-center text-sm text-white/40">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/40">No transactions found</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => (
                  <tr key={txn.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                    <td className="px-4 py-3 capitalize">{txn.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[txn.status] || 'bg-white/5 text-white/60'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">₦{Number(txn.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/50">{txn.id.slice(0, 12)}...</td>
                    <td className="px-4 py-3 text-white/50">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
