import { useState } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router';
import { ArrowLeft, Plus, Search } from 'lucide-react';

export default function VirtualAccountsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [lookup, setLookup] = useState('');
  const [lookupResult, setLookupResult] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ accountRef: '', accountName: '', currency: 'NGN' });
  const [createResult, setCreateResult] = useState('');

  async function handleCreate() {
    if (!form.accountRef || !form.accountName) return;
    setCreateResult('');
    try {
      const res = await api.virtualAccounts.create(form);
      setCreateResult(`Virtual account created: ${(res as { accountNumber?: string }).accountNumber || ''}`);
      setShowCreate(false);
    } catch (err: unknown) {
      setCreateResult(err instanceof Error ? err.message : 'Failed');
    }
  }

  async function handleLookup() {
    if (!lookup) return;
    try {
      const res = await api.virtualAccounts.lookup(lookup);
      setLookupResult(res as Record<string, unknown>);
    } catch { setLookupResult(null); }
  }

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
              <p className="text-sm text-white/60">Virtual accounts</p>
            </div>
          </div>
          <button onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">
            <Plus size={16} /> Create account
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        {showCreate && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-sm font-semibold">New virtual account</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/50">Account reference</label>
                <input value={form.accountRef} onChange={(e) => setForm({ ...form, accountRef: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Account name</label>
                <input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0e12] px-3 py-2 text-sm outline-none">
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <button onClick={handleCreate}
              className="mt-4 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">
              Create
            </button>
            {createResult && (
              <div className="mt-4 rounded-xl border border-[#dfe66a]/20 bg-[#dfe66a]/10 px-4 py-3 text-sm text-[#dfe66a]">{createResult}</div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-sm font-semibold">Look up a virtual account</h3>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
              <input value={lookup} onChange={(e) => setLookup(e.target.value)}
                placeholder="Enter account number"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#dfe66a]/50" />
            </div>
            <button onClick={handleLookup}
              className="rounded-xl bg-[#dfe66a] px-4 text-sm font-semibold text-[#111]">
              Search
            </button>
          </div>

          {lookupResult && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <pre className="text-xs text-white/70">{JSON.stringify(lookupResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
