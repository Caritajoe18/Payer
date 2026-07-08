import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { useNavigate, Link } from 'react-router';
import {
  Building2, CreditCard, TrendingUp, Users, Zap, ArrowRight,
  ReceiptText, ShoppingCart, Wifi, Smartphone, Eye, EyeOff,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  customerEmail?: string;
}

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ revenue: 0, pending: 0, completed: 0 });
  const [balance, setBalance] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    api.accounts.balance().then((d) => {
      const amt = (d as { amount?: string }).amount;
      if (amt) setBalance(amt);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.transactions.list({ page: 1 }).then((data) => {
      const txns = (Array.isArray(data) ? data : (data as { rows?: Transaction[] }).rows || []) as Transaction[];
      setTransactions(txns.slice(0, 5));
      const revenue = txns.filter((t) => t.status === 'success').reduce((s, t) => s + Number(t.amount), 0);
      setStats({
        revenue,
        pending: txns.filter((t) => t.status === 'pending').length,
        completed: txns.filter((t) => t.status === 'success').length,
      });
    }).catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <header className="border-b border-white/10 bg-[#06070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#dfe66a]">Payer</Link>
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/transactions', label: 'Transactions' },
                { to: '/payroll', label: 'Payroll' },
                { to: '/utilities', label: 'Utilities' },
                { to: '/virtual-accounts', label: 'Accounts' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">{user.email}</span>
            <button onClick={logout} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Command center</h1>
          <p className="mt-1 text-sm text-white/50">Welcome back, {user.name}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-[#dfe66a]/20 bg-[#dfe66a]/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50">Account balance</p>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/40 hover:text-white/70">
                {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="mt-1 text-xl font-semibold">
              {balance ? (
                showBalance ? `₦${Number(balance).toLocaleString()}` : '****'
              ) : (
                <span className="text-white/30">—</span>
              )}
            </p>
          </div>
          {[
            { label: 'Total revenue', value: `₦${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
            { label: 'Pending', value: String(stats.pending), icon: ReceiptText, color: 'text-yellow-400' },
            { label: 'Completed', value: String(stats.completed), icon: CreditCard, color: 'text-blue-400' },
            { label: 'Transactions', value: String(transactions.length), icon: Building2, color: 'text-[#dfe66a]' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl bg-white/5 p-2.5 ${color}`}><Icon size={18} /></div>
                <div>
                  <p className="text-xs text-white/50">{label}</p>
                  <p className="mt-1 text-xl font-semibold">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent transactions</h2>
              <Link to="/transactions" className="text-xs text-[#dfe66a] hover:underline">View all</Link>
            </div>
            {transactions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">No transactions yet</div>
            ) : (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        txn.status === 'success' ? 'bg-green-400' : txn.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="font-medium capitalize">{txn.type.replace('_', ' ')}</p>
                        <p className="text-xs text-white/40">{txn.customerEmail || txn.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <span className="font-semibold">₦{Number(txn.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold">Quick actions</h2>
              <div className="mt-4 space-y-2">
                {[
                  { to: '/payroll', label: 'Run payroll', icon: Users },
                  { to: '/utilities', label: 'Buy airtime', icon: Smartphone },
                  { to: '/utilities', label: 'Pay bills', icon: Wifi },
                  { to: '/virtual-accounts', label: 'Create account', icon: Building2 },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm transition hover:bg-white/5"
                  >
                    <div className="rounded-lg bg-[#dfe66a]/10 p-2 text-[#dfe66a]"><Icon size={16} /></div>
                    <span>{label}</span>
                    <ArrowRight size={14} className="ml-auto text-white/30" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
