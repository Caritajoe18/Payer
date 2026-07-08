import { useMemo, useState, useCallback } from "react";
import {
  ArrowRight, Minus, Plus, Search,
  ShoppingCart, Trash2, X,
} from "lucide-react";
import { Link } from "react-router";
import { loadCart, saveCart, cartTotal, cartCount, type CartItem, type Product } from "../../lib/cart";

type Category = "Electronics" | "Accessories" | "Lifestyle";

const PRODUCTS: Product[] = [
  { id: "p1", name: "WH-1000XM5", brand: "Sony", price: 349,
    photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format",
    description: "Industry-leading noise cancellation. 30-hour battery life.", stock: 14 },
  { id: "p2", name: "AirPods Pro (2nd Gen)", brand: "Apple", price: 249,
    photo: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop&auto=format",
    description: "Adaptive transparency and immersive sound.", stock: 8 },
  { id: "p3", name: "MX Master 3S", brand: "Logitech", price: 50,
    photo: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&auto=format",
    description: "Precision controls and long battery life.", stock: 22 },
  { id: "p4", name: "Classic Notebook Set", brand: "Moleskine", price: 28,
    photo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&auto=format",
    description: "A refined set for ideas, notes, and planning.", stock: 35 },
];

const CATEGORIES: (Category | "All")[] = ["All", "Electronics", "Accessories", "Lifestyle"];

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");

  const persist = useCallback((next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCart((prev) => {
      const updated = typeof next === 'function' ? next(prev) : next;
      saveCart(updated);
      return updated;
    });
  }, []);

  const total = cartTotal(cart);
  const count = cartCount(cart);

  const addToCart = (product: Product) => {
    persist((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      return existing
        ? prev.map((item) => (item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item))
        : [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    persist((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: string) => persist((prev) => prev.filter((item) => item.product.id !== id));

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const categoryMatches = category === "All" || product.category === category;
      const query = search.toLowerCase();
      const searchMatches = query === "" || product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query);
      return categoryMatches && searchMatches;
    });
  }, [category, search]);

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <header className="border-b border-white/10 bg-[#06070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#dfe66a]">Payer</Link>
            <p className="mt-1 text-sm text-white/60">SME financial command center</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/about" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">About</Link>
            <Link to="/login" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">Admin</Link>
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">
              <ShoppingCart size={16} /> Cart
              {count > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dfe66a] text-[10px] font-semibold text-[#111]">{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <section id="catalog">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">Catalog</p>
              <h2 className="mt-2 text-2xl font-semibold">Pick the essentials for your next order.</h2>
            </div>
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/30" />
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((option) => (
              <button key={option} onClick={() => setCategory(option)}
                className={`rounded-full px-3.5 py-2 text-sm transition ${category === option ? "bg-[#dfe66a] text-[#111]" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>
                {option}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filtered.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                <img src={product.photo} alt={product.name} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">{product.brand}</p>
                      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
                    </div>
                    <span className="text-sm font-semibold text-[#dfe66a]">₦{product.price.toLocaleString()}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/65">{product.description}</p>
                  <button onClick={() => addToCart(product)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#dfe66a]/30 bg-[#dfe66a]/10 px-3.5 py-2 text-sm font-semibold text-[#dfe66a] transition hover:bg-[#dfe66a]/20">
                    <ShoppingCart size={15} /> Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
          <div className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#08090d] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">Cart</p>
                <h2 className="mt-1 text-xl font-semibold">Your order</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-full border border-white/10 p-2 text-white/70"><X size={16} /></button>
            </div>

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/60">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.product.name}</p>
                        <p className="mt-1 text-xs text-white/45">₦{item.product.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-white/45 hover:text-red-400"><Trash2 size={15} /></button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.product.id, -1)} className="rounded-full border border-white/10 p-1.5 text-white/70"><Minus size={14} /></button>
                        <span className="min-w-6 text-center text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="rounded-full border border-white/10 p-1.5 text-white/70"><Plus size={14} /></button>
                      </div>
                      <span className="text-sm font-semibold text-[#dfe66a]">₦{(item.product.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₦{total.toLocaleString()}</span>
                </div>
                <Link to={`/checkout`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#dfe66a] px-4 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#e8ee7b]">
                  Continue to checkout <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
