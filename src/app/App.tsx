import { useState, useMemo } from "react";
import {
  ShoppingCart, X, ArrowRight, Package, CreditCard, Users,
  Zap, FileText, BarChart3, LogOut, Search, Eye, EyeOff,
  Plus, Minus, Trash2, Lock, Building2, Signal, Wifi,
  Check, CheckCircle, TrendingUp, Menu, Receipt,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────

type Category = "Electronics" | "Accessories" | "Lifestyle";
type Product = {
  id: string; name: string; brand: string; price: number;
  category: Category; photo: string; description: string; stock: number;
};
type CartItem = { product: Product; qty: number };
type Page = "store" | "checkout" | "admin-gate" | "admin";
type AdminView = "dashboard" | "payroll" | "bills" | "airtime" | "transactions";

// ─── Data ──────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: "p1", name: "WH-1000XM5", brand: "Sony", price: 349, category: "Electronics",
    photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format",
    description: "Industry-leading noise cancellation. 30-hour battery life.", stock: 14 },
  { id: "p2", name: "AirPods Pro (2nd Gen)", brand: "Apple", price: 249, category: "Electronics",
    photo: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop&auto=format",
    description: "Adaptive Transparency. H2 chip. USB-C charging case.", stock: 8 },
  { id: "p3", name: "MX Master 3S", brand: "Logitech", price: 99, category: "Accessories",
    photo: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&auto=format",
    description: "8K DPI optical sensor. Near-silent clicks. Ergonomic design.", stock: 22 },
  { id: "p4", name: "K2 v2 Wireless", brand: "Keychron", price: 89, category: "Accessories",
    photo: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format",
    description: "75% compact layout. Gateron Brown switches. Bluetooth 5.1.", stock: 18 },
  { id: "p5", name: "Nano 45W Charger", brand: "Anker", price: 35, category: "Accessories",
    photo: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop&auto=format",
    description: "GaN II technology. Charges laptop, phone, and tablet.", stock: 40 },
  { id: "p6", name: "Classic Notebook Set", brand: "Moleskine", price: 28, category: "Lifestyle",
    photo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&auto=format",
    description: "Set of 3. Ruled and dotted. Lay-flat binding.", stock: 35 },
  { id: "p7", name: "Stagg EKG Kettle", brand: "Fellow", price: 165, category: "Lifestyle",
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&auto=format",
    description: "Variable temperature. 1L capacity. Matte black finish.", stock: 7 },
  { id: "p8", name: "Reverence Hand Balm", brand: "Aesop", price: 45, category: "Lifestyle",
    photo: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&auto=format",
    description: "Mandarin rind, rosemary, and vetiver extract.", stock: 20 },
  { id: "p9", name: "Slim Wallet", brand: "Peak Design", price: 59, category: "Accessories",
    photo: "https://images.unsplash.com/photo-1627123424574-724758594785?w=600&h=600&fit=crop&auto=format",
    description: "1–15 cards. Aluminum side button. Lifetime guarantee.", stock: 12 },
  { id: "p10", name: "Note Sleeve Wallet", brand: "Bellroy", price: 49, category: "Accessories",
    photo: "https://images.unsplash.com/photo-1614786269829-d24616faf56d?w=600&h=600&fit=crop&auto=format",
    description: "RFID protection. Fits 4–12 cards plus cash.", stock: 16 },
  { id: "p11", name: "Phone (2a) Plus", brand: "Nothing", price: 399, category: "Electronics",
    photo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop&auto=format",
    description: "50MP camera. 5000mAh. Glyph Interface.", stock: 5 },
  { id: "p12", name: "Mug 2 (14 oz)", brand: "Ember", price: 149, category: "Lifestyle",
    photo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop&auto=format",
    description: "Temperature control 120–145°F. 80-min battery.", stock: 11 },
];

const EMPLOYEES = [
  { id: "e1", name: "Adaeze Okonkwo",  role: "Head of Engineering",  bank: "GTBank ···4821",  salary: 850000, lastPaid: "Jun 28, 2026" },
  { id: "e2", name: "Emeka Nwosu",     role: "Senior Designer",       bank: "Access ···2903",  salary: 620000, lastPaid: "Jun 28, 2026" },
  { id: "e3", name: "Tunde Adeyemi",   role: "Product Manager",       bank: "Zenith ···1147",  salary: 780000, lastPaid: "Jun 28, 2026" },
  { id: "e4", name: "Chisom Eze",      role: "Backend Engineer",      bank: "UBA ···6634",     salary: 690000, lastPaid: "Jun 28, 2026" },
  { id: "e5", name: "Fatima Aliyu",    role: "Finance Analyst",       bank: "GTBank ···8801",  salary: 510000, lastPaid: "Jun 28, 2026" },
  { id: "e6", name: "Rotimi Bello",    role: "DevOps Engineer",       bank: "Stanbic ···3392", salary: 730000, lastPaid: "Jun 28, 2026" },
  { id: "e7", name: "Ngozi Ikenna",    role: "Customer Success",      bank: "Access ···7215",  salary: 380000, lastPaid: "Jun 28, 2026" },
  { id: "e8", name: "Olumide Adegoke", role: "Sales Lead",            bank: "Zenith ···5560",  salary: 440000, lastPaid: "Jun 28, 2026" },
];

const BILLS = [
  { id: "b1", name: "Office Electricity",  vendor: "EKEDC",          amount: 145000, due: "Jul 5, 2026",  icon: "electricity", status: "Due" },
  { id: "b2", name: "Internet (500Mbps)",  vendor: "Spectranet",     amount: 85000,  due: "Jul 8, 2026",  icon: "wifi",        status: "Due" },
  { id: "b3", name: "Office Water Supply", vendor: "Lagos Water Corp",amount: 22000,  due: "Jul 10, 2026", icon: "water",       status: "Due" },
  { id: "b4", name: "Figma Business",      vendor: "Figma Inc",      amount: 38400,  due: "Jul 14, 2026", icon: "software",    status: "Upcoming" },
  { id: "b5", name: "GitHub Enterprise",   vendor: "GitHub Inc",     amount: 61200,  due: "Jul 14, 2026", icon: "software",    status: "Upcoming" },
  { id: "b6", name: "Office Cleaning",     vendor: "CleanPros NG",   amount: 55000,  due: "Jul 20, 2026", icon: "cleaning",    status: "Upcoming" },
];

const STAFF = [
  { id: "s1", name: "Adaeze Okonkwo",  phone: "0812 345 6789", network: "MTN" },
  { id: "s2", name: "Emeka Nwosu",     phone: "0803 456 7890", network: "Airtel" },
  { id: "s3", name: "Tunde Adeyemi",   phone: "0701 234 5678", network: "Glo" },
  { id: "s4", name: "Chisom Eze",      phone: "0816 789 0123", network: "MTN" },
  { id: "s5", name: "Fatima Aliyu",    phone: "0905 678 9012", network: "9mobile" },
  { id: "s6", name: "Rotimi Bello",    phone: "0811 901 2345", network: "MTN" },
  { id: "s7", name: "Ngozi Ikenna",    phone: "0802 012 3456", network: "Airtel" },
  { id: "s8", name: "Olumide Adegoke", phone: "0708 123 4567", network: "Glo" },
];

const TRANSACTIONS = [
  { id: "t1",  date: "Jul 2, 2026",  type: "Sale",    desc: "Nomba Checkout · Order #4821",      amount:  349,     status: "Successful", ref: "NCK-0042821" },
  { id: "t2",  date: "Jul 2, 2026",  type: "Sale",    desc: "Nomba Checkout · Order #4820",      amount:   99,     status: "Successful", ref: "NCK-0042820" },
  { id: "t3",  date: "Jul 1, 2026",  type: "Payroll", desc: "Salary · Adaeze Okonkwo",           amount: -850000,  status: "Successful", ref: "PAY-0010081" },
  { id: "t4",  date: "Jul 1, 2026",  type: "Payroll", desc: "Salary · Emeka Nwosu",              amount: -620000,  status: "Successful", ref: "PAY-0010082" },
  { id: "t5",  date: "Jul 1, 2026",  type: "Sale",    desc: "Nomba Checkout · Order #4819",      amount:  249,     status: "Successful", ref: "NCK-0042819" },
  { id: "t6",  date: "Jun 30, 2026", type: "Bill",    desc: "EKEDC Office Electricity",          amount: -145000,  status: "Successful", ref: "BIL-0000231" },
  { id: "t7",  date: "Jun 30, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4818",      amount:  448,     status: "Successful", ref: "NCK-0042818" },
  { id: "t8",  date: "Jun 29, 2026", type: "Airtime", desc: "Airtime Top-up · 8 Staff (MTN)",   amount: -40000,   status: "Successful", ref: "AIR-0000102" },
  { id: "t9",  date: "Jun 29, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4817",      amount:  165,     status: "Successful", ref: "NCK-0042817" },
  { id: "t10", date: "Jun 28, 2026", type: "Payroll", desc: "Salary · Tunde Adeyemi",            amount: -780000,  status: "Successful", ref: "PAY-0010083" },
  { id: "t11", date: "Jun 28, 2026", type: "Payroll", desc: "Salary · Chisom Eze",               amount: -690000,  status: "Successful", ref: "PAY-0010084" },
  { id: "t12", date: "Jun 28, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4816",      amount:  399,     status: "Successful", ref: "NCK-0042816" },
  { id: "t13", date: "Jun 27, 2026", type: "Bill",    desc: "Spectranet Internet (500Mbps)",     amount: -85000,   status: "Successful", ref: "BIL-0000230" },
  { id: "t14", date: "Jun 27, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4815",      amount:   59,     status: "Pending",    ref: "NCK-0042815" },
  { id: "t15", date: "Jun 26, 2026", type: "Airtime", desc: "Data Bundle · 8 Staff (5GB each)", amount: -64000,   status: "Successful", ref: "AIR-0000101" },
  { id: "t16", date: "Jun 26, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4814",      amount:   89,     status: "Successful", ref: "NCK-0042814" },
  { id: "t17", date: "Jun 25, 2026", type: "Payroll", desc: "Salary · Fatima Aliyu",             amount: -510000,  status: "Successful", ref: "PAY-0010085" },
  { id: "t18", date: "Jun 25, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4813",      amount:  198,     status: "Successful", ref: "NCK-0042813" },
  { id: "t19", date: "Jun 24, 2026", type: "Bill",    desc: "GitHub Enterprise Subscription",    amount: -61200,   status: "Successful", ref: "BIL-0000229" },
  { id: "t20", date: "Jun 24, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4812",      amount:  149,     status: "Successful", ref: "NCK-0042812" },
  { id: "t21", date: "Jun 23, 2026", type: "Airtime", desc: "Data Bundle · 8 Staff (1GB each)", amount: -16000,   status: "Successful", ref: "AIR-0000100" },
  { id: "t22", date: "Jun 23, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4811",      amount:   35,     status: "Failed",     ref: "NCK-0042811" },
  { id: "t23", date: "Jun 22, 2026", type: "Payroll", desc: "Salary · Rotimi Bello",             amount: -730000,  status: "Successful", ref: "PAY-0010086" },
  { id: "t24", date: "Jun 22, 2026", type: "Sale",    desc: "Nomba Checkout · Order #4810",      amount:  498,     status: "Successful", ref: "NCK-0042810" },
  { id: "t25", date: "Jun 21, 2026", type: "Bill",    desc: "CleanPros NG Office Cleaning",      amount: -55000,   status: "Successful", ref: "BIL-0000228" },
];

const SALES_DATA = [
  { day: "Jun 3",  sales: 28400 }, { day: "Jun 5",  sales: 41200 }, { day: "Jun 7",  sales: 33800 },
  { day: "Jun 9",  sales: 56100 }, { day: "Jun 11", sales: 48900 }, { day: "Jun 13", sales: 61400 },
  { day: "Jun 15", sales: 39200 }, { day: "Jun 17", sales: 52700 }, { day: "Jun 19", sales: 44500 },
  { day: "Jun 21", sales: 67800 }, { day: "Jun 23", sales: 59300 }, { day: "Jun 25", sales: 71200 },
  { day: "Jun 27", sales: 63900 }, { day: "Jun 29", sales: 82400 }, { day: "Jul 1",  sales: 74100 },
  { day: "Jul 2",  sales: 91600 },
];

const PLANS = ["₦500 Airtime", "100MB · ₦100", "1GB · ₦300", "5GB · ₦1,000", "10GB · ₦2,500"];
const CATEGORIES: (Category | "All")[] = ["All", "Electronics", "Accessories", "Lifestyle"];
const NETWORK_COLORS: Record<string, string> = {
  MTN: "text-yellow-400", Airtel: "text-red-400", Glo: "text-green-400", "9mobile": "text-emerald-500",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}

// ─── Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("store");
  const [adminView, setAdminView] = useState<AdminView>("dashboard");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const hit = prev.find((i) => i.product.id === product.id);
      return hit
        ? prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev.map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0)
    );

  const removeItem = (id: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== id));

  const filtered = useMemo(() =>
    PRODUCTS.filter((p) => {
      const cat = category === "All" || p.category === category;
      const q = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
      return cat && q;
    }), [category, search]);

  const isShop = page === "store" || page === "checkout";

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-[#EFEFEF]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {isShop && (
        <Navbar cartCount={cartCount} onCart={() => setCartOpen(true)} onAdmin={() => setPage("admin-gate")} onLogo={() => setPage("store")} />
      )}

      {page === "store" && (
        <StorePage products={filtered} category={category} setCategory={setCategory} search={search} setSearch={setSearch} onAdd={addToCart} />
      )}
      {page === "checkout" && (
        <CheckoutPage cart={cart} total={cartTotal} onBack={() => setPage("store")} onSuccess={() => setCart([])} />
      )}
      {page === "admin-gate" && (
        <AdminGate onSuccess={() => setPage("admin")} onBack={() => setPage("store")} />
      )}
      {page === "admin" && (
        <AdminShell view={adminView} setView={setAdminView} onLogout={() => setPage("store")} />
      )}

      {cartOpen && isShop && (
        <CartDrawer cart={cart} total={cartTotal} onClose={() => setCartOpen(false)} onQty={updateQty} onRemove={removeItem} onCheckout={() => { setCartOpen(false); setPage("checkout"); }} />
      )}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar({ cartCount, onCart, onAdmin, onLogo }: { cartCount: number; onCart: () => void; onAdmin: () => void; onLogo: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0C0C0D]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <button onClick={onLogo} className="text-[#DDE04A] font-medium text-lg tracking-tight" style={{ fontFamily: "'Geist Mono', monospace" }}>
          Payer
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onAdmin} className="text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase" style={{ fontFamily: "'Geist Mono', monospace" }}>
            Admin
          </button>
          <button onClick={onCart} className="relative flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-full px-4 py-2 text-sm transition-colors">
            <ShoppingCart size={13} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#DDE04A] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ fontFamily: "'Geist Mono', monospace" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Store ─────────────────────────────────────────────────────────────────

function StorePage({ products, category, setCategory, search, setSearch, onAdd }: {
  products: Product[]; category: Category | "All"; setCategory: (c: Category | "All") => void;
  search: string; setSearch: (s: string) => void; onAdd: (p: Product) => void;
}) {
  return (
    <main className="max-w-6xl mx-auto px-5 pt-10 pb-28">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-white mb-1">Everything you need.</h1>
        <p className="text-white/30 text-sm">Free shipping on orders over $200.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#DDE04A]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                category === c
                  ? "bg-[#DDE04A] text-black border-[#DDE04A]"
                  : "bg-white/[0.03] text-white/40 border-white/[0.07] hover:text-white/70 hover:border-white/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-white/25 text-sm">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
        </div>
      )}
    </main>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [flash, setFlash] = useState(false);
  const handle = () => { onAdd(product); setFlash(true); setTimeout(() => setFlash(false), 1100); };

  return (
    <div className="group bg-[#131316] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.18] transition-all duration-200">
      <div className="aspect-square bg-white/[0.03] overflow-hidden">
        <img src={product.photo} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-3.5">
        <p className="text-[9px] text-white/25 uppercase tracking-[0.12em] mb-1" style={{ fontFamily: "'Geist Mono', monospace" }}>{product.brand}</p>
        <h3 className="text-sm font-medium text-white leading-snug mb-2.5 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium" style={{ fontFamily: "'Geist Mono', monospace" }}>${product.price}</span>
          <button
            onClick={handle}
            className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
              flash
                ? "bg-[#DDE04A]/15 text-[#DDE04A] border-[#DDE04A]/30"
                : "bg-transparent text-white/50 border-white/[0.08] hover:bg-[#DDE04A] hover:text-black hover:border-[#DDE04A]"
            }`}
          >
            {flash ? "✓ Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ───────────────────────────────────────────────────────────

function CartDrawer({ cart, total, onClose, onQty, onRemove, onCheckout }: {
  cart: CartItem[]; total: number; onClose: () => void;
  onQty: (id: string, d: number) => void; onRemove: (id: string) => void; onCheckout: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-[360px] z-50 bg-[#111114] border-l border-white/[0.07] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <h2 className="text-sm font-medium">Cart <span className="text-white/30" style={{ fontFamily: "'Geist Mono', monospace" }}>({cart.length})</span></h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={17} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 && <p className="text-center py-20 text-white/20 text-sm">Your cart is empty.</p>}
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-3 items-center">
              <div className="w-14 h-14 bg-white/[0.04] rounded-lg overflow-hidden shrink-0">
                <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-white/30 uppercase tracking-widest" style={{ fontFamily: "'Geist Mono', monospace" }}>{product.brand}</p>
                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                <p className="text-xs text-white/40" style={{ fontFamily: "'Geist Mono', monospace" }}>${product.price}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => onQty(product.id, -1)} className="w-5 h-5 rounded border border-white/[0.09] text-white/35 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center">
                  <Minus size={9} />
                </button>
                <span className="text-xs w-4 text-center" style={{ fontFamily: "'Geist Mono', monospace" }}>{qty}</span>
                <button onClick={() => onQty(product.id, 1)} className="w-5 h-5 rounded border border-white/[0.09] text-white/35 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center">
                  <Plus size={9} />
                </button>
                <button onClick={() => onRemove(product.id)} className="w-5 h-5 ml-1 text-white/20 hover:text-red-400 transition-colors flex items-center justify-center">
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-white/[0.07] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Subtotal</span>
              <span style={{ fontFamily: "'Geist Mono', monospace" }}>${total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-[#DDE04A] text-black text-sm font-medium py-3 rounded-xl hover:bg-[#c8d040] transition-colors flex items-center justify-center gap-2">
              Checkout <ArrowRight size={14} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── Checkout ──────────────────────────────────────────────────────────────

function CheckoutPage({ cart, total, onBack, onSuccess }: { cart: CartItem[]; total: number; onBack: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", state: "", card: "", expiry: "", cvv: "" });
  const [done, setDone] = useState(false);
  const [orderNum] = useState(`PYR-${Math.floor(10000 + Math.random() * 90000)}`);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); onSuccess(); };

  const shipping = total >= 200 ? 0 : 15;

  if (done) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#DDE04A]/10 border border-[#DDE04A]/25 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={26} className="text-[#DDE04A]" />
        </div>
        <h2 className="text-xl font-medium mb-2">Order confirmed.</h2>
        <p className="text-white/30 text-sm mb-1">You'll receive a confirmation email shortly.</p>
        <p className="text-[11px] text-white/20 mb-8" style={{ fontFamily: "'Geist Mono', monospace" }}>{orderNum}</p>
        <button onClick={onBack} className="bg-[#DDE04A] text-black text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#c8d040] transition-colors">
          Continue shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-5 pt-10 pb-28">
      <button onClick={onBack} className="text-[11px] text-white/25 hover:text-white/60 transition-colors mb-8 flex items-center gap-1.5" style={{ fontFamily: "'Geist Mono', monospace" }}>
        ← Back to store
      </button>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-12">
        <form onSubmit={onSubmit} className="space-y-8">
          <section>
            <h2 className="text-sm font-medium mb-4 text-white/60 uppercase tracking-widest text-[11px]" style={{ fontFamily: "'Geist Mono', monospace" }}>Contact</h2>
            <div className="space-y-3">
              <Field label="Full name"      value={form.name}    onChange={(v) => set("name", v)}    required />
              <Field label="Email address"  value={form.email}   onChange={(v) => set("email", v)}   type="email" required />
            </div>
          </section>
          <section>
            <h2 className="text-sm font-medium mb-4 text-white/60 uppercase tracking-widest text-[11px]" style={{ fontFamily: "'Geist Mono', monospace" }}>Delivery</h2>
            <div className="space-y-3">
              <Field label="Street address" value={form.address} onChange={(v) => set("address", v)} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"  value={form.city}  onChange={(v) => set("city", v)}  required />
                <Field label="State" value={form.state} onChange={(v) => set("state", v)} required />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-sm font-medium mb-4 text-white/60 uppercase tracking-widest text-[11px]" style={{ fontFamily: "'Geist Mono', monospace" }}>Payment</h2>
            <div className="space-y-3">
              <Field label="Card number"    value={form.card}   onChange={(v) => set("card", v)}   placeholder="1234 5678 9012 3456" required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry (MM/YY)" value={form.expiry} onChange={(v) => set("expiry", v)} placeholder="MM/YY" required />
                <Field label="CVV"             value={form.cvv}    onChange={(v) => set("cvv", v)}    placeholder="123" required />
              </div>
            </div>
          </section>
          <button type="submit" className="w-full bg-[#DDE04A] text-black text-sm font-medium py-3.5 rounded-xl hover:bg-[#c8d040] transition-colors">
            Pay ${(total + shipping).toFixed(2)} via Nomba
          </button>
        </form>

        <div className="bg-[#131316] border border-white/[0.07] rounded-xl p-5 h-fit sticky top-20">
          <h3 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-4" style={{ fontFamily: "'Geist Mono', monospace" }}>Order summary</h3>
          <div className="space-y-3 mb-5">
            {cart.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-white/[0.04] rounded-lg overflow-hidden shrink-0">
                  <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                  <p className="text-[10px] text-white/30">Qty {qty}</p>
                </div>
                <span className="text-xs text-white/50" style={{ fontFamily: "'Geist Mono', monospace" }}>${(product.price * qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.07] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-white/35">
              <span>Subtotal</span>
              <span style={{ fontFamily: "'Geist Mono', monospace" }}>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/35">
              <span>Shipping</span>
              <span style={{ fontFamily: "'Geist Mono', monospace" }}>{shipping === 0 ? "Free" : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-white/[0.07]">
              <span>Total</span>
              <span className="text-[#DDE04A]" style={{ fontFamily: "'Geist Mono', monospace" }}>${(total + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Geist Mono', monospace" }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/15 outline-none focus:border-[#DDE04A]/45 transition-colors"
      />
    </div>
  );
}

// ─── Admin Gate ────────────────────────────────────────────────────────────

function AdminGate({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === "payer") { onSuccess(); return; }
    setErr(true); setTimeout(() => setErr(false), 1400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-8">
          <div className="w-11 h-11 bg-[#DDE04A]/10 border border-[#DDE04A]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={15} className="text-[#DDE04A]" />
          </div>
          <h1 className="text-lg font-medium">Admin access</h1>
          <p className="text-white/25 text-xs mt-1">Payer Financial Dashboard</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className={`w-full bg-white/[0.04] border rounded-xl px-4 pr-11 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors ${err ? "border-red-500/50" : "border-white/[0.07] focus:border-[#DDE04A]/45"}`}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {err && <p className="text-red-400 text-xs" style={{ fontFamily: "'Geist Mono', monospace" }}>Incorrect password.</p>}
          <button type="submit" className="w-full bg-[#DDE04A] text-black text-sm font-medium py-3 rounded-xl hover:bg-[#c8d040] transition-colors">
            Access Dashboard
          </button>
        </form>
        <p className="text-center text-white/15 text-[10px] mt-5" style={{ fontFamily: "'Geist Mono', monospace" }}>hint: payer</p>
        <button onClick={onBack} className="w-full text-center text-white/20 hover:text-white/45 text-xs mt-3 transition-colors">
          ← Back to store
        </button>
      </div>
    </div>
  );
}

// ─── Admin Shell ───────────────────────────────────────────────────────────

const NAV: { id: AdminView; label: string; Icon: React.ElementType }[] = [
  { id: "dashboard",    label: "Dashboard",    Icon: BarChart3 },
  { id: "payroll",      label: "Payroll",       Icon: Users },
  { id: "bills",        label: "Bills",         Icon: FileText },
  { id: "airtime",      label: "Airtime & Data", Icon: Signal },
  { id: "transactions", label: "Transactions",  Icon: Receipt },
];

function AdminShell({ view, setView, onLogout }: { view: AdminView; setView: (v: AdminView) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-52 bg-[#0E0E10] border-r border-white/[0.06] flex flex-col transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <p className="text-[#DDE04A] font-medium text-base" style={{ fontFamily: "'Geist Mono', monospace" }}>Payer</p>
          <p className="text-white/20 text-[10px] mt-0.5 tracking-widest uppercase" style={{ fontFamily: "'Geist Mono', monospace" }}>Admin</p>
        </div>
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setView(id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                view === id
                  ? "bg-[#DDE04A]/10 text-[#DDE04A] border border-[#DDE04A]/12"
                  : "text-white/35 hover:text-white/65 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>
        <div className="px-2.5 py-3 border-t border-white/[0.06]">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/25 hover:text-white/55 hover:bg-white/[0.03] transition-colors">
            <LogOut size={14} />Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="flex-1 md:ml-52 overflow-y-auto">
        <div className="md:hidden sticky top-0 z-20 bg-[#0C0C0D]/95 backdrop-blur-sm border-b border-white/[0.06] flex items-center gap-3 px-4 py-3">
          <button onClick={() => setOpen(true)} className="text-white/35"><Menu size={17} /></button>
          <span className="text-[#DDE04A] text-sm font-medium" style={{ fontFamily: "'Geist Mono', monospace" }}>Payer Admin</span>
        </div>
        <div className="p-6 md:p-8 max-w-5xl">
          {view === "dashboard"    && <AdminDashboard />}
          {view === "payroll"      && <AdminPayroll />}
          {view === "bills"        && <AdminBills />}
          {view === "airtime"      && <AdminAirtime />}
          {view === "transactions" && <AdminTransactions />}
        </div>
      </div>
    </div>
  );
}

// ─── Admin: Dashboard ──────────────────────────────────────────────────────

function AdminDashboard() {
  const kpis = [
    { label: "Revenue (Jul)",     value: "₦4,281,600", note: "+18.4% vs Jun",  accent: true },
    { label: "Today's Sales",     value: "$448",        note: "2 orders",       accent: false },
    { label: "Pending Payroll",   value: "₦5,000,000", note: "8 staff",        accent: false },
    { label: "Bills Due (7 days)",value: "₦252,000",   note: "3 bills",        accent: false },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-white/25 text-[11px] mt-1" style={{ fontFamily: "'Geist Mono', monospace" }}>Jul 2, 2026 · Live via Nomba Checkout</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-[#131316] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[9px] uppercase tracking-[0.12em] text-white/25 mb-3" style={{ fontFamily: "'Geist Mono', monospace" }}>{k.label}</p>
            <p className="text-xl font-medium text-white mb-1" style={{ fontFamily: "'Geist Mono', monospace" }}>{k.value}</p>
            <p className={`text-[10px] ${k.accent ? "text-[#DDE04A]" : "text-white/25"}`} style={{ fontFamily: "'Geist Mono', monospace" }}>{k.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#131316] border border-white/[0.07] rounded-xl p-5 mb-5">
        <div className="mb-5">
          <h3 className="text-sm font-medium">Revenue — 30 days</h3>
          <p className="text-[10px] text-white/25 mt-0.5" style={{ fontFamily: "'Geist Mono', monospace" }}>Nomba Checkout · USD</p>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={SALES_DATA} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#DDE04A" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#DDE04A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "Geist Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "Geist Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#1A1A1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 11, fontFamily: "Geist Mono" }}
              labelStyle={{ color: "rgba(255,255,255,0.4)" }}
              itemStyle={{ color: "#DDE04A" }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="sales" stroke="#DDE04A" strokeWidth={1.5} fill="url(#cg)" dot={false} activeDot={{ r: 3, fill: "#DDE04A" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#131316] border border-white/[0.07] rounded-xl p-5">
        <h3 className="text-sm font-medium mb-4">Recent activity</h3>
        <div className="divide-y divide-white/[0.045]">
          {TRANSACTIONS.slice(0, 7).map((t) => (
            <TxRow key={t.id} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TxRow({ t }: { t: typeof TRANSACTIONS[0] }) {
  const icon = t.type === "Sale" ? <ShoppingCart size={11} className="text-[#DDE04A]" />
             : t.type === "Payroll" ? <Users size={11} className="text-blue-400" />
             : t.type === "Bill" ? <FileText size={11} className="text-orange-400" />
             : <Signal size={11} className="text-purple-400" />;
  const bg = t.type === "Sale" ? "bg-[#DDE04A]/8" : t.type === "Payroll" ? "bg-blue-500/8" : t.type === "Bill" ? "bg-orange-500/8" : "bg-purple-500/8";

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium line-clamp-1">{t.desc}</p>
        <p className="text-[10px] text-white/25" style={{ fontFamily: "'Geist Mono', monospace" }}>{t.date}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs ${t.amount > 0 ? "text-[#DDE04A]" : "text-white/40"}`} style={{ fontFamily: "'Geist Mono', monospace" }}>
          {t.amount > 0 ? `+$${t.amount}` : `-₦${Math.abs(t.amount).toLocaleString()}`}
        </p>
        <p className={`text-[9px] ${t.status === "Successful" ? "text-white/20" : t.status === "Pending" ? "text-yellow-500/60" : "text-red-400/60"}`}>
          {t.status}
        </p>
      </div>
    </div>
  );
}

// ─── Admin: Payroll ────────────────────────────────────────────────────────

function AdminPayroll() {
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState<Set<string>>(new Set());

  const pay = (id: string) => {
    setRunning((s) => new Set([...s, id]));
    setTimeout(() => {
      setPaid((s) => new Set([...s, id]));
      setRunning((s) => { const n = new Set(s); n.delete(id); return n; });
    }, 1200);
  };

  const payAll = () => EMPLOYEES.forEach((e, i) => { if (!paid.has(e.id)) setTimeout(() => pay(e.id), i * 180); });
  const pending = EMPLOYEES.filter((e) => !paid.has(e.id)).reduce((s, e) => s + e.salary, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="text-xl font-medium">Payroll</h1>
          <p className="text-white/25 text-[11px] mt-1" style={{ fontFamily: "'Geist Mono', monospace" }}>Instant bank transfers via Nomba</p>
        </div>
        <button onClick={payAll} disabled={paid.size === EMPLOYEES.length} className="shrink-0 bg-[#DDE04A] text-black text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#c8d040] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          Run All · ₦{pending.toLocaleString()}
        </button>
      </div>

      <div className="bg-[#131316] border border-white/[0.07] rounded-xl divide-y divide-white/[0.045]">
        {EMPLOYEES.map((emp) => {
          const isPaid = paid.has(emp.id);
          const isRunning = running.has(emp.id);
          return (
            <div key={emp.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs text-white/50 shrink-0">
                {initials(emp.name)}
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{emp.name}</p>
                  <p className="text-[10px] text-white/30 truncate">{emp.role}</p>
                </div>
                <p className="text-xs text-white/30 hidden sm:block self-center" style={{ fontFamily: "'Geist Mono', monospace" }}>{emp.bank}</p>
                <div className="hidden sm:block self-center">
                  <p className="text-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>₦{emp.salary.toLocaleString()}</p>
                  <p className="text-[10px] text-white/20">Last: {emp.lastPaid}</p>
                </div>
              </div>
              <button
                onClick={() => pay(emp.id)}
                disabled={isPaid || isRunning}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                  isPaid ? "border-[#DDE04A]/20 text-[#DDE04A]/50 bg-[#DDE04A]/5 cursor-not-allowed"
                  : isRunning ? "border-white/10 text-white/25 animate-pulse cursor-not-allowed"
                  : "border-white/[0.09] text-white/45 hover:bg-[#DDE04A] hover:text-black hover:border-[#DDE04A]"
                }`}
              >
                {isPaid ? "✓ Paid" : isRunning ? "Sending…" : "Pay"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-center text-white/15 text-[10px] mt-4" style={{ fontFamily: "'Geist Mono', monospace" }}>
        {paid.size} of {EMPLOYEES.length} salaries disbursed this cycle
      </p>
    </div>
  );
}

// ─── Admin: Bills ──────────────────────────────────────────────────────────

function AdminBills() {
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const outstanding = BILLS.filter((b) => !paid.has(b.id)).reduce((s, b) => s + b.amount, 0);

  const BillIcon = ({ icon, isPaid }: { icon: string; isPaid: boolean }) => {
    if (isPaid) return <Check size={14} className="text-[#DDE04A]" />;
    if (icon === "electricity") return <Zap size={14} className="text-yellow-400" />;
    if (icon === "wifi")        return <Wifi size={14} className="text-blue-400" />;
    if (icon === "water")       return <Building2 size={14} className="text-cyan-400" />;
    if (icon === "software")    return <CreditCard size={14} className="text-purple-400" />;
    return <Package size={14} className="text-orange-400" />;
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-medium">Bills</h1>
        <p className="text-white/25 text-[11px] mt-1" style={{ fontFamily: "'Geist Mono', monospace" }}>Office expenses · Jul 2026</p>
      </div>

      <div className="space-y-2.5 mb-5">
        {BILLS.map((bill) => {
          const isPaid = paid.has(bill.id);
          return (
            <div key={bill.id} className="bg-[#131316] border border-white/[0.07] rounded-xl px-5 py-4 flex items-center gap-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? "bg-[#DDE04A]/10" : "bg-white/[0.05]"}`}>
                <BillIcon icon={bill.icon} isPaid={isPaid} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{bill.name}</p>
                <p className="text-[10px] text-white/25" style={{ fontFamily: "'Geist Mono', monospace" }}>{bill.vendor} · Due {bill.due}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium" style={{ fontFamily: "'Geist Mono', monospace" }}>₦{bill.amount.toLocaleString()}</p>
                <p className={`text-[10px] ${isPaid ? "text-[#DDE04A]/50" : bill.status === "Due" ? "text-red-400/60" : "text-white/20"}`} style={{ fontFamily: "'Geist Mono', monospace" }}>
                  {isPaid ? "Paid" : bill.status}
                </p>
              </div>
              <button
                onClick={() => setPaid((s) => new Set([...s, bill.id]))}
                disabled={isPaid}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  isPaid ? "border-[#DDE04A]/15 text-[#DDE04A]/35 cursor-not-allowed"
                  : "border-white/[0.09] text-white/40 hover:bg-[#DDE04A] hover:text-black hover:border-[#DDE04A]"
                }`}
              >
                {isPaid ? "✓" : "Pay"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-3.5 flex justify-between items-center text-sm">
        <span className="text-white/35">Total outstanding</span>
        <span className="font-medium" style={{ fontFamily: "'Geist Mono', monospace" }}>₦{outstanding.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ─── Admin: Airtime ────────────────────────────────────────────────────────

function AdminAirtime() {
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState<Set<string>>(new Set());

  const send = (id: string) => {
    if (!plans[id] || sent.has(id)) return;
    setSending((s) => new Set([...s, id]));
    setTimeout(() => {
      setSent((s) => new Set([...s, id]));
      setSending((s) => { const n = new Set(s); n.delete(id); return n; });
    }, 1000);
  };

  const sendAll = () => {
    STAFF.forEach((s, i) => {
      if (!plans[s.id]) setPlans((p) => ({ ...p, [s.id]: PLANS[2] }));
      setTimeout(() => send(s.id), i * 150 + 50);
    });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="text-xl font-medium">Airtime & Data</h1>
          <p className="text-white/25 text-[11px] mt-1" style={{ fontFamily: "'Geist Mono', monospace" }}>Staff benefits distribution</p>
        </div>
        <button onClick={sendAll} className="shrink-0 bg-[#DDE04A] text-black text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#c8d040] transition-colors">
          Send to All
        </button>
      </div>

      <div className="bg-[#131316] border border-white/[0.07] rounded-xl divide-y divide-white/[0.045]">
        {STAFF.map((s) => {
          const isSent = sent.has(s.id);
          const isSending = sending.has(s.id);
          return (
            <div key={s.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs text-white/50 shrink-0">
                {initials(s.name)}
              </div>
              <div className="flex-1 min-w-[130px]">
                <p className="text-sm font-medium">{s.name}</p>
                <p className={`text-[10px] ${NETWORK_COLORS[s.network] || "text-white/30"}`} style={{ fontFamily: "'Geist Mono', monospace" }}>
                  {s.network} · {s.phone}
                </p>
              </div>
              <select
                value={plans[s.id] || ""}
                onChange={(e) => setPlans((p) => ({ ...p, [s.id]: e.target.value }))}
                disabled={isSent}
                className="text-xs bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-white/60 outline-none disabled:opacity-40 cursor-pointer"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                <option value="">Select plan</option>
                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button
                onClick={() => send(s.id)}
                disabled={isSent || isSending || !plans[s.id]}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  isSent ? "border-[#DDE04A]/20 text-[#DDE04A]/50 bg-[#DDE04A]/5 cursor-not-allowed"
                  : isSending ? "border-white/10 text-white/25 animate-pulse cursor-not-allowed"
                  : !plans[s.id] ? "border-white/[0.05] text-white/18 cursor-not-allowed"
                  : "border-white/[0.09] text-white/45 hover:bg-[#DDE04A] hover:text-black hover:border-[#DDE04A]"
                }`}
              >
                {isSent ? "✓ Sent" : isSending ? "Sending…" : "Send"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin: Transactions ───────────────────────────────────────────────────

const TX_TYPES = ["All", "Sale", "Payroll", "Bill", "Airtime"] as const;
type TxType = typeof TX_TYPES[number];

function AdminTransactions() {
  const [filter, setFilter] = useState<TxType>("All");
  const [search, setSearch] = useState("");

  const rows = useMemo(() =>
    TRANSACTIONS.filter((t) => {
      const byType = filter === "All" || t.type === filter;
      const bySearch = search === "" || t.desc.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
      return byType && bySearch;
    }), [filter, search]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-medium">Transactions</h1>
        <p className="text-white/25 text-[11px] mt-1" style={{ fontFamily: "'Geist Mono', monospace" }}>All money movements · Jun – Jul 2026</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description or reference…"
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/18 outline-none focus:border-[#DDE04A]/40 transition-colors"
            style={{ fontFamily: "'Geist Mono', monospace" }}
          />
        </div>
        <div className="flex gap-1.5">
          {TX_TYPES.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-[10px] font-medium border transition-colors ${
                filter === f ? "bg-[#DDE04A] text-black border-[#DDE04A]"
                : "bg-white/[0.03] text-white/35 border-white/[0.07] hover:text-white/60"
              }`}
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#131316] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[100px_1fr_110px_90px_120px] gap-4 px-5 py-3 border-b border-white/[0.05]">
          {["Date", "Description", "Amount", "Status", "Reference"].map((h) => (
            <p key={h} className="text-[9px] text-white/20 uppercase tracking-[0.12em]" style={{ fontFamily: "'Geist Mono', monospace" }}>{h}</p>
          ))}
        </div>
        <div className="divide-y divide-white/[0.04]">
          {rows.map((t) => (
            <div key={t.id} className="grid grid-cols-1 sm:grid-cols-[100px_1fr_110px_90px_120px] gap-1 sm:gap-4 px-5 py-3.5 items-center">
              <p className="text-[10px] text-white/25 hidden sm:block" style={{ fontFamily: "'Geist Mono', monospace" }}>{t.date}</p>
              <div>
                <p className="text-xs font-medium">{t.desc}</p>
                <p className="text-[10px] text-white/20 sm:hidden" style={{ fontFamily: "'Geist Mono', monospace" }}>{t.date}</p>
              </div>
              <p className={`text-xs font-medium ${t.amount > 0 ? "text-[#DDE04A]" : "text-white/45"}`} style={{ fontFamily: "'Geist Mono', monospace" }}>
                {t.amount > 0 ? `+$${t.amount}` : `-₦${Math.abs(t.amount).toLocaleString()}`}
              </p>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border w-fit ${
                t.status === "Successful" ? "border-white/[0.08] text-white/25"
                : t.status === "Pending"    ? "border-yellow-500/30 text-yellow-500/65 bg-yellow-500/5"
                : "border-red-500/30 text-red-400/65 bg-red-500/5"
              }`} style={{ fontFamily: "'Geist Mono', monospace" }}>{t.status}</span>
              <p className="text-[9px] text-white/18 hidden sm:block" style={{ fontFamily: "'Geist Mono', monospace" }}>{t.ref}</p>
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="text-center py-12 text-white/20 text-xs" style={{ fontFamily: "'Geist Mono', monospace" }}>No transactions found.</p>
        )}
      </div>

      <p className="text-center text-white/15 text-[10px] mt-4" style={{ fontFamily: "'Geist Mono', monospace" }}>
        {rows.length} of {TRANSACTIONS.length} transactions
      </p>
    </div>
  );
}
