import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { api } from '../../lib/api';
import { loadCart, saveCart, cartTotal, cartCount, clearCart, type CartItem } from '../../lib/cart';
import { ShoppingCart, CheckCircle, ArrowRight, Loader2, Trash2, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ checkoutLink?: string; orderReference?: string } | null>(null);
  const [error, setError] = useState('');

  const orderRef = searchParams.get('orderReference');
  const total = cartTotal(cart);
  const count = cartCount(cart);

  const removeItem = (id: string) => {
    const next = cart.filter((item) => item.product.id !== id);
    setCart(next);
  };

  useEffect(() => {
    if (orderRef) {
      clearCart();
    }
  }, [orderRef]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  async function handleCheckout() {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.checkout.createOrder({
        amount: total,
        customerEmail: email,
        customerName: name || undefined,
        orderReference: orderRef || undefined,
        callbackUrl: `${window.location.origin}/checkout/success`,
      });
      setResult(res as { checkoutLink?: string; orderReference?: string });
      if ((res as { checkoutLink?: string }).checkoutLink) {
        window.open((res as { checkoutLink: string }).checkoutLink, '_blank');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    }
    setLoading(false);
  }

  if (orderRef) {
    return (
      <div className="min-h-screen bg-[#06070a] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-400/10">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-semibold">Payment successful!</h1>
          <p className="mt-2 text-sm text-white/60">Order reference: <span className="font-mono text-[#dfe66a]">{orderRef}</span></p>
          <p className="mt-1 text-sm text-white/50">Your order is being processed.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#dfe66a] px-5 py-3 text-sm font-semibold text-[#111]">
            Back to store <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#dfe66a]">Payer</Link>
            <h1 className="mt-4 text-2xl font-semibold">Checkout</h1>
          </div>
          <Link to="/" className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            <ArrowLeft size={16} /> Back to store
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <h2 className="text-lg font-semibold mb-6">Order summary</h2>
            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/60">Your cart is empty.</div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <img src={item.product.photo} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product.name}</p>
                      <p className="text-xs text-white/50">{item.product.brand} &middot; Qty: {item.qty}</p>
                      <p className="text-sm font-semibold text-[#dfe66a] mt-1">₦{(item.product.price * item.qty).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-white/45 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <h2 className="text-lg font-semibold mb-6">Payment details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#dfe66a]/50"
                  placeholder="customer@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Name (optional)</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#dfe66a]/50"
                  placeholder="John Doe" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Items ({count})</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-semibold text-white">
                  <span>Total</span>
                  <span className="text-[#dfe66a]">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

              <button onClick={handleCheckout} disabled={loading || cart.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dfe66a] px-5 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#e8ee7b] disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                Pay ₦{total.toLocaleString()} with Nomba
              </button>
            </div>

            {result && (
              <div className="mt-4 rounded-xl border border-[#dfe66a]/20 bg-[#dfe66a]/10 px-4 py-3 text-sm text-[#dfe66a]">
                Order created: {result.orderReference}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
