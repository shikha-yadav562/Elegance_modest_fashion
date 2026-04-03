export const CART_KEY = "modesty_cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id && c.size === item.size);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(id: string, size: string): void {
  const cart = getCart().filter((c) => !(c.id === id && c.size === size));
  saveCart(cart);
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateQuantity(
  id: string,
  size: string,
  quantity: number,
): void {
  const cart = getCart();
  const item = cart.find((c) => c.id === id && c.size === size);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}
