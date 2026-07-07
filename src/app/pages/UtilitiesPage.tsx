import { useState } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router';
import { ArrowLeft, Smartphone, Wifi, Zap } from 'lucide-react';

const NETWORKS = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];
const TELCOS = ['mtn', 'airtel', 'glo', '9mobile'];

export default function UtilitiesPage() {
  const [tab, setTab] = useState<'airtime' | 'data' | 'bills'>('airtime');

  // Airtime
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('MTN');
  const [airtimeResult, setAirtimeResult] = useState('');

  // Data
  const [dataPhone, setDataPhone] = useState('');
  const [dataNetwork, setDataNetwork] = useState('mtn');
  const [plans, setPlans] = useState<{ amount: number; plan: string }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [dataResult, setDataResult] = useState('');

  // Bills
  const [biller, setBiller] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [billResult, setBillResult] = useState('');

  async function handleAirtime() {
    if (!phone || !amount) return;
    setAirtimeResult('');
    try {
      const res = await api.utilities.airtime(phone, Number(amount), network);
      setAirtimeResult(`Airtime purchase successful`);
    } catch (err: unknown) {
      setAirtimeResult(err instanceof Error ? err.message : 'Failed');
    }
  }

  async function handleFetchPlans() {
    try {
      const data = await api.utilities.dataPlans(dataNetwork);
      setPlans(data as { amount: number; plan: string }[]);
    } catch { setPlans([]); }
  }

  async function handleBuyData() {
    if (!dataPhone || !selectedPlan) return;
    setDataResult('');
    try {
      setDataResult(`Data bundle purchase initiated`);
    } catch (err: unknown) {
      setDataResult(err instanceof Error ? err.message : 'Failed');
    }
  }

  async function handlePayBill() {
    if (!biller || !billAmount) return;
    setBillResult('');
    try {
      const res = await api.utilities.payBill({ biller, amount: Number(billAmount), customerId: customerId || undefined });
      setBillResult(`Bill payment successful`);
    } catch (err: unknown) {
      setBillResult(err instanceof Error ? err.message : 'Failed');
    }
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
              <p className="text-sm text-white/60">Utility payments</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex gap-2">
          {([
            { key: 'airtime', label: 'Airtime', icon: Smartphone },
            { key: 'data', label: 'Data bundles', icon: Wifi },
            { key: 'bills', label: 'Bill payments', icon: Zap },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                tab === key ? 'bg-[#dfe66a] text-[#111]' : 'border border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {tab === 'airtime' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Buy airtime</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/50">Network</label>
                <div className="flex gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNetwork(n)}
                      className={`rounded-full px-3 py-1.5 text-xs transition ${
                        network === n ? 'bg-[#dfe66a] text-[#111]' : 'border border-white/10 text-white/60'
                      }`}
                    >{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Phone number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Amount (NGN)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
            </div>
            <button onClick={handleAirtime}
              className="mt-4 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">
              Purchase airtime
            </button>
            {airtimeResult && (
              <div className="mt-4 rounded-xl border border-[#dfe66a]/20 bg-[#dfe66a]/10 px-4 py-3 text-sm text-[#dfe66a]">{airtimeResult}</div>
            )}
          </div>
        )}

        {tab === 'data' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Data bundles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/50">Network</label>
                <div className="flex gap-2">
                  {TELCOS.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setDataNetwork(t); setPlans([]); }}
                      className={`rounded-full px-3 py-1.5 text-xs transition ${
                        dataNetwork === t ? 'bg-[#dfe66a] text-[#111]' : 'border border-white/10 text-white/60'
                      }`}
                    >{t.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Phone number</label>
                <input value={dataPhone} onChange={(e) => setDataPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
            </div>
            <button onClick={handleFetchPlans}
              className="mt-3 rounded-full border border-[#dfe66a]/30 px-4 py-2 text-sm text-[#dfe66a]">
              Load plans
            </button>

            {plans.length > 0 && (
              <div className="mt-4 space-y-2">
                {plans.map((p) => (
                  <label key={p.plan} className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                    selectedPlan === p.plan ? 'border-[#dfe66a]/50 bg-[#dfe66a]/10' : 'border-white/10 hover:bg-white/5'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="plan" checked={selectedPlan === p.plan}
                        onChange={() => setSelectedPlan(p.plan)} className="accent-[#dfe66a]" />
                      <span>{p.plan}</span>
                    </div>
                    <span className="font-semibold">₦{p.amount.toLocaleString()}</span>
                  </label>
                ))}
                <button onClick={handleBuyData}
                  disabled={!selectedPlan}
                  className="mt-3 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111] disabled:opacity-50">
                  Buy data
                </button>
              </div>
            )}
            {dataResult && (
              <div className="mt-4 rounded-xl border border-[#dfe66a]/20 bg-[#dfe66a]/10 px-4 py-3 text-sm text-[#dfe66a]">{dataResult}</div>
            )}
          </div>
        )}

        {tab === 'bills' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Pay bills</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/50">Biller type</label>
                <select value={biller} onChange={(e) => setBiller(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0e12] px-3 py-2 text-sm outline-none">
                  <option value="">Select biller</option>
                  <option value="electricity">Electricity (Discos)</option>
                  <option value="cable_tv">Cable TV</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Customer ID / Meter number</label>
                <input value={customerId} onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Amount (NGN)</label>
                <input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#dfe66a]/50" />
              </div>
            </div>
            <button onClick={handlePayBill}
              className="mt-4 rounded-full bg-[#dfe66a] px-4 py-2 text-sm font-semibold text-[#111]">
              Pay bill
            </button>
            {billResult && (
              <div className="mt-4 rounded-xl border border-[#dfe66a]/20 bg-[#dfe66a]/10 px-4 py-3 text-sm text-[#dfe66a]">{billResult}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
