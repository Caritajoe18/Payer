import { Link } from "react-router";
import { ArrowRight, Building2, CreditCard, ReceiptText, ShieldCheck, TrendingUp, Zap } from "lucide-react";

const highlightCards = [
  { title: "Storefront checkout", copy: "Let customers browse and pay instantly without account friction.", icon: CreditCard },
  { title: "Treasury controls", copy: "Handle payroll, bills, and airtime from one secure command center.", icon: Building2 },
  { title: "Live visibility", copy: "Track incoming revenue and outgoing spend in a single view.", icon: TrendingUp },
];

const modules = ["Guest checkout", "Instant payroll", "Utility payments", "Transaction monitoring"];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <header className="border-b border-white/10 bg-[#06070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#dfe66a]">Payer</Link>
            <p className="mt-1 text-sm text-white/60">About the platform</p>
          </div>
          <Link to="/" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">Back to store</Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#dfe66a]/30 bg-[#dfe66a]/10 px-3 py-1 text-sm text-[#dfe66a]">
              <ShieldCheck size={16} /> Built for small and growing businesses
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">One platform for selling, paying, and staying in control.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Payer unifies storefront payments, staff payroll, and utility operations so owners can move faster and keep every transaction visible.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#dfe66a] px-5 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#e8ee7b]">
                Open the storefront <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10">Admin dashboard</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#dfe66a]/15 p-3 text-[#dfe66a]"><Zap size={22} /></div>
              <div>
                <p className="text-sm font-semibold">Operations snapshot</p>
                <p className="text-sm text-white/55">Live overview for today</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm text-white/70"><span>Revenue collected</span><span className="font-semibold text-white">₦1.2M</span></div>
                <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 w-4/5 rounded-full bg-[#dfe66a]" /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/55">Payroll ready</p>
                  <p className="mt-2 text-xl font-semibold">8 staff</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/55">Utilities due</p>
                  <p className="mt-2 text-xl font-semibold">3 payments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">Core modules</p>
                <h2 className="mt-2 text-3xl font-semibold">Everything owners need in one place.</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {highlightCards.map(({ title, copy, icon: Icon }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-[#dfe66a]/10 p-3 text-[#dfe66a]"><Icon size={20} /></div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">Why it matters</p>
                <h2 className="mt-2 text-3xl font-semibold">Less tool switching, clearer decisions.</h2>
                <p className="mt-4 text-lg leading-8 text-white/70">
                  Payer replaces scattered spreadsheets and fragmented payments with a focused experience built around the daily rhythm of a modern SME.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="flex items-center gap-2 text-[#dfe66a]"><ReceiptText size={18} /><span className="text-sm font-semibold">Included workflows</span></div>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  {modules.map((item) => (
                    <li key={item} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#dfe66a]" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
