import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useNavigate, Link } from 'react-router';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#dfe66a]">Payer</Link>
          <h1 className="mt-4 text-2xl font-semibold">Admin dashboard</h1>
          <p className="mt-2 text-sm text-white/60">
            {isRegister ? 'Create your admin account' : 'Sign in to manage your business'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-8">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          {isRegister && (
            <div>
              <label className="mb-2 block text-sm text-white/70">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#dfe66a]/50"
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#dfe66a]/50"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#dfe66a]/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dfe66a] px-5 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#e8ee7b]"
          >
            {isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={16} />
          </button>

          <p className="text-center text-sm text-white/50">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-[#dfe66a] hover:underline">
              {isRegister ? 'Sign in' : 'Register'}
            </button>
          </p>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
          <ShieldCheck size={14} /> Secured login
        </div>
      </div>
    </div>
  );
}
