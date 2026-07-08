import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router';
import { ArrowLeft, Search, Plus, Trash2, Send, UserCheck, CheckSquare, Square } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email?: string;
  accountNumber: string;
  bankCode: string;
  bankName?: string;
  salary: number;
  isActive: boolean;
}

interface Bank {
  code: string;
  name: string;
}

export default function PayrollPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ accountName: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState('');

  const [form, setForm] = useState({ name: '', email: '', accountNumber: '', bankCode: '', bankName: '', salary: '' });
  const [manualBank, setManualBank] = useState(false);

  useEffect(() => {
    api.staff.list().then((d) => setStaff(d as Staff[])).catch(() => {});
    api.payroll.fetchBanks().then((d) => {
      if (Array.isArray(d)) setBanks(d as Bank[]);
    }).catch(() => {});
  }, []);

  async function handleBankLookup() {
    if (!form.accountNumber || !form.bankCode) return;
    try {
      const result = await api.payroll.bankLookup(form.accountNumber, form.bankCode);
      setLookupResult(result as { accountName: string });
    } catch { setLookupResult(null); }
  }

  async function handleAddStaff() {
    if (!form.name || !form.accountNumber || !form.bankCode || !form.salary) return;
    try {
      const s = await api.staff.create({
        name: form.name,
        accountNumber: form.accountNumber,
        bankCode: form.bankCode,
        bankName: form.bankName || undefined,
        salary: Number(form.salary),
        email: form.email || undefined,
      });
      setStaff((prev) => [...prev, s as Staff]);
      setShowAdd(false);
      setForm({ name: '', email: '', accountNumber: '', bankCode: '', bankName: '', salary: '' });
      setLookupResult(null);
    } catch { /* ignore */ }
  }

  async function handleDelete(id: string) {
    try {
      await api.staff.delete(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch { /* ignore */ }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === staff.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(staff.map((s) => s.id)));
    }
  }

  async function handleRunPayroll() {
    setRunning(true);
    setResult('');
    const target = selected.size > 0 ? staff.filter((s) => selected.has(s.id)) : staff;
    if (target.length === 0) { setResult('No staff selected'); setRunning(false); return; }
    try {
      const res = await api.payroll.runPayroll(target.map((s) => s.id));
      setResult(`Payroll sent to ${target.length} staff member${target.length > 1 ? 's' : ''}`);
      setSelected(new Set());
    } catch (err: unknown) {
      setResult(err instanceof Error ? err.message : 'Payroll failed');
    }
    setRunning(false);
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
              <p className="text-sm text-white/60">Payroll management</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Staff ({staff.length})</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-2 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">
            <Plus size={16} /> Add staff
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-sm font-semibold">New staff member</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-white/50">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Email (optional)</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Bank</label>
                {banks.length > 0 && !manualBank ? (
                  <select value={form.bankCode} onChange={(e) => { 
                    if (e.target.value === '__manual__') { setManualBank(true); setForm({ ...form, bankCode: '', bankName: '' }); return; }
                    setForm({ ...form, bankCode: e.target.value }); setLookupResult(null); 
                  }}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0e12] px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50">
                    <option value="">Select bank</option>
                    {banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                    <option value="__manual__">Other (enter manually)</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input value={form.bankCode} onChange={(e) => { setForm({ ...form, bankCode: e.target.value }); setLookupResult(null); }}
                      placeholder="Bank code (e.g. 011)"
                      className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
                    <input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      placeholder="Bank name (e.g. First Bank)"
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
                  </div>
                )}
                {banks.length > 0 && !manualBank && (
                  <button onClick={() => setManualBank(true)} className="mt-1 text-xs text-white/40 hover:text-white/60">Or enter manually</button>
                )}
                {manualBank && banks.length > 0 && (
                  <button onClick={() => setManualBank(false)} className="mt-1 text-xs text-white/40 hover:text-white/60">Use bank list</button>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Account number</label>
                <div className="flex gap-2">
                  <input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
                  <button onClick={handleBankLookup} className="rounded-xl border border-white/10 px-3 text-white/60 hover:bg-white/5">
                    <UserCheck size={16} />
                  </button>
                </div>
                {lookupResult && <p className="mt-1 text-xs text-green-400">{lookupResult.accountName}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Monthly salary (NGN)</label>
                <input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
            </div>
            <button onClick={handleAddStaff}
              className="mt-4 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">
              Save staff
            </button>
          </div>
        )}

        <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
          {staff.length === 0 ? (
            <div className="p-12 text-center text-sm text-white/40">No staff added yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium w-10">
                    <button onClick={toggleAll} className="text-white/40 hover:text-white/70">
                      {selected.size === staff.length ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Account</th>
                  <th className="px-4 py-3 font-medium">Bank</th>
                  <th className="px-4 py-3 font-medium">Salary</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                  {staff.map((s) => (
                  <tr key={s.id} className={`border-b border-white/5 transition hover:bg-white/[0.02] ${selected.has(s.id) ? 'bg-[#dfe66a]/5' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(s.id)} className="text-white/40 hover:text-white/70">
                        {selected.has(s.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-white/60">{s.accountNumber}</td>
                    <td className="px-4 py-3 text-white/60">
                      {s.bankName ? <span>{s.bankName} <span className="text-white/30">({s.bankCode})</span></span> : s.bankCode}
                    </td>
                    <td className="px-4 py-3 font-semibold">₦{Number(s.salary).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(s.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#dfe66a]/5 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Run monthly payroll</h3>
              <p className="mt-1 text-sm text-white/50">
                {selected.size > 0 ? `${selected.size} selected · ` : ''}{staff.length} active staff · Total: ₦{staff.reduce((s, m) => s + Number(m.salary), 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleRunPayroll}
              disabled={running || staff.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-[#dfe66a] px-5 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#e8ee7b] disabled:opacity-50"
            >
              <Send size={16} /> {running ? 'Processing...' : 'Run payroll'}
            </button>
          </div>
          {result && (
            <div className="mt-4 rounded-xl border border-[#dfe66a]/20 bg-[#dfe66a]/10 px-4 py-3 text-sm text-[#dfe66a]">{result}</div>
          )}
        </div>
      </main>
    </div>
  );
}
