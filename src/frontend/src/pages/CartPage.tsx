import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  type CartItem,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(getCart());

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleRemove = (id: string, size: string) => {
    removeFromCart(id, size);
    setCart(getCart());
  };

  const handleQty = (id: string, size: string, qty: number) => {
    updateQuantity(id, size, qty);
    setCart(getCart());
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <h1 className="font-serif text-4xl text-charcoal uppercase tracking-widest text-center mb-2">
          Your Cart
        </h1>
        <div className="w-12 h-0.5 bg-gold mx-auto mb-10" />

        {cart.length === 0 ? (
          <div
            className="text-center py-24 flex flex-col items-center gap-6"
            data-ocid="cart.empty_state"
          >
            <div className="w-24 h-24 rounded-full bg-sand/50 flex items-center justify-center">
              <ShoppingBag
                size={40}
                className="text-gold/60"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-serif text-2xl text-charcoal/60 mb-2">
                Your cart is empty
              </p>
              <p className="font-sans text-sm text-soft-gray">
                Discover our beautiful collection and find something you love.
              </p>
            </div>
            <Link
              to="/products"
              data-ocid="cart.primary_button"
              className="inline-flex items-center gap-2 bg-gold text-charcoal font-sans font-semibold text-sm uppercase tracking-[0.25em] px-8 py-3.5 rounded-full hover:bg-gold-deep transition-colors"
            >
              Shop Collection <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items */}
            <div className="flex-1 space-y-4" data-ocid="cart.list">
              {cart.map((item, i) => (
                <div
                  key={`${item.id}-${item.size}`}
                  data-ocid={`cart.item.${i + 1}`}
                  className="flex gap-4 bg-white rounded-2xl p-4 shadow-luxury"
                >
                  <Link
                    to="/product/$id"
                    params={{ id: item.id }}
                    className="shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-32 object-cover rounded-xl"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif font-semibold text-charcoal text-base leading-tight mb-1">
                          {item.name}
                        </h3>
                        <p className="font-sans text-xs text-soft-gray uppercase tracking-widest">
                          Size: {item.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id, item.size)}
                        data-ocid={`cart.delete_button.${i + 1}`}
                        aria-label={`Remove ${item.name}`}
                        className="text-soft-gray hover:text-destructive transition-colors ml-2"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-sand rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            handleQty(item.id, item.size, item.quantity - 1)
                          }
                          data-ocid={`cart.secondary_button.${i + 1}`}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-sand/50 transition-colors"
                        >
                          <Minus size={12} aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center font-sans text-sm font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQty(item.id, item.size, item.quantity + 1)
                          }
                          data-ocid={`cart.primary_button.${i + 1}`}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-sand/50 transition-colors"
                        >
                          <Plus size={12} aria-hidden="true" />
                        </button>
                      </div>
                      <span className="font-sans font-bold text-charcoal">
                        ₹ {(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 shrink-0" data-ocid="cart.panel">
              <div className="bg-white rounded-2xl p-6 shadow-luxury sticky top-28">
                <h2 className="font-serif font-semibold text-charcoal text-xl uppercase tracking-widest mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-sans text-sm text-soft-gray">
                    <span>Subtotal</span>
                    <span className="text-charcoal font-medium">
                      ₹ {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-soft-gray">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-green-600 font-medium"
                          : "text-charcoal font-medium"
                      }
                    >
                      {shipping === 0 ? "Free" : `₹ ${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-sans text-xs text-gold-deep">
                      Add ₹ {(5000 - subtotal).toLocaleString("en-IN")} more for
                      free shipping
                    </p>
                  )}
                  <div className="border-t border-sand pt-4 flex justify-between font-serif font-bold text-charcoal text-lg">
                    <span>Total</span>
                    <span>₹ {total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  data-ocid="cart.submit_button"
                  className="w-full bg-gold text-charcoal font-sans font-bold text-sm uppercase tracking-[0.25em] py-4 rounded-xl hover:bg-gold-deep hover:shadow-gold transition-all duration-300 mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  data-ocid="cart.link"
                  className="block text-center font-sans text-xs text-soft-gray hover:text-gold transition-colors mt-3 tracking-widest uppercase"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
