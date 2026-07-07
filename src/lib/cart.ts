const STORAGE_KEY = 'payer_cart';

export interface Product {
  id: string; name: string; brand: string; price: number;
  photo: string; description: string; stock: number;
}
export interface CartItem { product: Product; qty: number }

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
