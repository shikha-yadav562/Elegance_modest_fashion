import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IMAGES } from "../assets/images";
import { getCartCount } from "../utils/cart";

const COLLECTION_LINKS = [
  "Ethnic Sets",
  "New Arrivals",
  "Daily Wear",
  "Kuch Khaas",
  "Festival Specials",
];

const ZEWAR_LINKS = [
  "All Accessories",
  "Oxidised Collection",
  "Under 999",
  "Ada Collection",
];

const COLLECTION_IMAGES = [IMAGES.editorialAbaya1, IMAGES.collectionAbaya1];

const ZEWAR_IMAGES = [IMAGES.collectionAbaya4, IMAGES.collectionAbaya5];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  const openDropdown = (name: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(name);
  };

  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-gradient-to-b from-black/60 via-black/30 to-transparent"
          : "bg-ivory/97 backdrop-blur-md shadow-luxury border-b border-sand/40"
      }`}
    >
      {/* ── Main Navbar: [left logo | right nav+icons] ── */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center h-20">
        {/* LEFT: Brand Logo — flush with left margin */}
        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 shrink-0 group mr-auto"
          data-ocid="nav.link"
        >
          {/* Ornamental crescent / star emblem */}
          <div
            className={`transition-colors duration-500 ${
              transparent ? "text-amber-300" : "text-gold-deep"
            }`}
          >
            <svg
              width="32"
              height="20"
              viewBox="0 0 64 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Left flourish */}
              <path
                d="M2 16 C8 8, 18 6, 26 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M2 16 C8 24, 18 26, 26 20"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Center star */}
              <circle cx="32" cy="16" r="3" fill="currentColor" opacity="0.9" />
              <circle
                cx="32"
                cy="16"
                r="5.5"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.5"
              />
              {/* Top & bottom tiny accents */}
              <line
                x1="32"
                y1="6"
                x2="32"
                y2="8"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <line
                x1="32"
                y1="24"
                x2="32"
                y2="26"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              {/* Right flourish */}
              <path
                d="M62 16 C56 8, 46 6, 38 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M62 16 C56 24, 46 26, 38 20"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

       

        {/* RIGHT: Desktop nav links + icons */}
        <div className="flex-1 flex items-center justify-end">
          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-6 mr-6">
            {/* Collections dropdown */}
            <li
              className="relative"
              onMouseEnter={() => openDropdown("collections")}
              onMouseLeave={closeDropdown}
            >
              <button
                type="button"
                data-ocid="nav.link"
                className={`flex items-center gap-1 font-sans text-xs tracking-widest uppercase transition-colors ${
                  transparent
                    ? "text-white font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] hover:text-amber-300"
                    : "text-charcoal/80 hover:text-gold"
                }`}
              >
                Collections <ChevronDown size={11} />
              </button>
              {activeDropdown === "collections" && (
                <div
                  className="absolute top-full right-0 mt-3 bg-ivory shadow-luxury-hover rounded-xl border border-sand/50 p-5 flex gap-8 min-w-[480px] z-50"
                  onMouseEnter={() => openDropdown("collections")}
                  onMouseLeave={closeDropdown}
                >
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
                      Shop By
                    </p>
                    {COLLECTION_LINKS.map((l) => (
                      <Link
                        key={l}
                        to="/products"
                        data-ocid="nav.link"
                        className="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors py-0.5"
                      >
                        {l}
                      </Link>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {COLLECTION_IMAGES.map((src) => (
                      <Link
                        key={src}
                        to="/products"
                        data-ocid="nav.link"
                        className="relative group w-28 h-36 overflow-hidden rounded-lg"
                      >
                        <img
                          src={src}
                          alt="Collection"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-charcoal/60 py-1.5 text-center">
                          <span className="text-ivory text-[9px] uppercase tracking-widest font-sans">
                            Shop Now
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* Zewar dropdown */}
            <li
              className="relative"
              onMouseEnter={() => openDropdown("zewar")}
              onMouseLeave={closeDropdown}
            >
              <button
                type="button"
                data-ocid="nav.link"
                className={`flex items-center gap-1 font-sans text-xs tracking-widest uppercase transition-colors ${
                  transparent
                    ? "text-white font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] hover:text-amber-300"
                    : "text-charcoal/80 hover:text-gold"
                }`}
              >
                Zewar <ChevronDown size={11} />
              </button>
              {activeDropdown === "zewar" && (
                <div
                  className="absolute top-full right-0 mt-3 bg-ivory shadow-luxury-hover rounded-xl border border-sand/50 p-5 flex gap-8 min-w-[440px] z-50"
                  onMouseEnter={() => openDropdown("zewar")}
                  onMouseLeave={closeDropdown}
                >
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
                      Accessories
                    </p>
                    {ZEWAR_LINKS.map((l) => (
                      <Link
                        key={l}
                        to="/products"
                        data-ocid="nav.link"
                        className="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors py-0.5"
                      >
                        {l}
                      </Link>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {ZEWAR_IMAGES.map((src) => (
                      <Link
                        key={src}
                        to="/products"
                        data-ocid="nav.link"
                        className="relative group w-28 h-36 overflow-hidden rounded-lg"
                      >
                        <img
                          src={src}
                          alt="Zewar"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-charcoal/60 py-1.5 text-center">
                          <span className="text-ivory text-[9px] uppercase tracking-widest font-sans">
                            Shop Now
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {["Products", "Combos"].map((label) => (
              <li key={label}>
                <Link
                  to="/products"
                  data-ocid="nav.link"
                  className={`font-sans text-xs tracking-widest uppercase transition-colors ${
                    transparent
                      ? "text-white font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] hover:text-amber-300"
                      : "text-charcoal/80 hover:text-gold"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/products"
                data-ocid="nav.link"
                className={`font-sans text-xs tracking-widest uppercase transition-colors ${
                  transparent
                    ? "text-red-300 hover:text-red-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                    : "text-red-400 hover:text-red-500"
                }`}
              >
                Sale
              </Link>
            </li>
          </ul>

          {/* Separator between nav links and icons — desktop only */}
          <div
            className={`hidden lg:block w-px h-4 mr-5 ${
              transparent ? "bg-white/30" : "bg-sand/60"
            }`}
          />

          {/* Search icon — desktop only */}
          <button
            type="button"
            aria-label="Search"
            className={`hidden lg:block mr-4 transition-colors hover:text-gold ${
              transparent
                ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                : "text-charcoal/70"
            }`}
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="View cart"
            data-ocid="nav.link"
            className={`relative transition-colors hover:text-gold ${
              transparent
                ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                : "text-charcoal"
            }`}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile */}
          <button
            type="button"
            className={`lg:hidden ml-4 transition-colors ${
              transparent
                ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                : "text-charcoal"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-ivory z-40 overflow-y-auto px-6 py-8 flex flex-col gap-5">
          {["Collections", "Zewar", "Products", "Combos", "Sale"].map(
            (label) => (
              <Link
                key={label}
                to="/products"
                data-ocid="nav.link"
                className="font-sans text-base tracking-widest uppercase text-charcoal/80 hover:text-gold transition-colors border-b border-sand pb-4"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ),
          )}
          <Link
            to="/cart"
            data-ocid="nav.link"
            className="flex items-center gap-2 font-sans text-base tracking-widest uppercase text-charcoal/80 hover:text-gold transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>
      )}
    </header>
  );
}
