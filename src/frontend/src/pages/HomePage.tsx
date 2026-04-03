import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Gem,
  Heart,
  Scissors,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import MarqueeBanner from "../components/MarqueeBanner";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useAllProducts, useTestimonials } from "../hooks/useQueries";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { addToCart } from "../utils/cart";

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Golden Hour Abaya Set",
    price: BigInt(8500),
    isNewArrival: true,
    description: "Exquisite embroidered abaya with intricate gold threadwork",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "/assets/generated/lookbook-abaya-emerald.dim_600x900.jpg",
    category: "abayas",
  },
  {
    id: "2",
    name: "Midnight Noir Abaya Set",
    price: BigInt(12000),
    isNewArrival: false,
    description:
      "Flowing abaya with gold detailing, perfect for special occasions",
    sizes: ["S", "M", "L"],
    imageUrl: "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
    category: "abayas",
  },
  {
    id: "3",
    name: "Ivory Embroidered Abaya",
    price: BigInt(7500),
    isNewArrival: true,
    description: "Elegant ivory abaya with delicate hand embroidery",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "/assets/generated/editorial-abaya-blush.dim_600x900.jpg",
    category: "abayas",
  },
  {
    id: "4",
    name: "Pearl Essence Abaya",
    price: BigInt(9800),
    isNewArrival: false,
    description: "Premium pearl-toned abaya with delicate embroidery",
    sizes: ["M", "L", "XL"],
    imageUrl: "/assets/generated/editorial-abaya-navy.dim_600x900.jpg",
    category: "abayas",
  },
  {
    id: "5",
    name: "Ivory Kuch Khaas Abaya",
    price: BigInt(15000),
    isNewArrival: true,
    description:
      "Specially curated ivory bridal abaya for your most precious moments",
    sizes: ["S", "M", "L"],
    imageUrl: "/assets/generated/lookbook-abaya-ivory.dim_600x900.jpg",
    category: "abayas",
  },
  {
    id: "6",
    name: "Terracotta Daily Abaya",
    price: BigInt(5500),
    isNewArrival: false,
    description: "Comfortable daily wear abaya in warm terracotta tones",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "/assets/generated/lookbook-abaya-mauve.dim_600x900.jpg",
    category: "abayas",
  },
  {
    id: "7",
    name: "Emerald Formal Abaya",
    price: BigInt(11500),
    isNewArrival: true,
    description: "Rich emerald full-length abaya for formal occasions",
    sizes: ["M", "L", "XL"],
    imageUrl: "/assets/generated/hero-slide-3-emerald.dim_1920x1080.jpg",
    category: "abayas",
  },
  {
    id: "8",
    name: "Blush Festive Abaya",
    price: BigInt(13500),
    isNewArrival: false,
    description: "Gorgeous blush abaya for festivals and celebrations",
    sizes: ["S", "M", "L"],
    imageUrl: "/assets/generated/hero-slide-2-ivory.dim_1920x1080.jpg",
    category: "abayas",
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    name: "Fatima Sheikh",
    message:
      "Absolutely stunning quality! The abaya I ordered is even more beautiful in person. Nida Khan has truly created something special.",
    rating: BigInt(5),
  },
  {
    name: "Zara Ahmed",
    message:
      "Finally a modest fashion brand that doesn't compromise on style. The abaya I got was perfect for Eid.",
    rating: BigInt(5),
  },
  {
    name: "Hina Malik",
    message:
      "The craftsmanship is impeccable. Every detail is carefully designed. Will definitely order again!",
    rating: BigInt(5),
  },
];

// Hero slides — each with a distinct color theme
const HERO_SLIDES = [
  {
    bg: "/assets/generated/hero-slide-1-gold.dim_1920x1080.jpg",
    label: "New Season 2026",
    heading: "Elegance in",
    headingAccent: "Modesty",
    subheading: "Timeless Abayas for the Modern Woman",
    cta: "Shop Collection",
    ctaLink: "/products",
    // Warm gold theme
    overlayFrom: "from-amber-950/60",
    overlayTo: "to-transparent",
    labelColor: "text-amber-300",
    accentColor: "from-amber-400 via-yellow-200 to-amber-400",
    dotActiveColor: "bg-amber-300",
    btnBorderColor:
      "border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-black",
  },
  {
    bg: "/assets/generated/hero-slide-2-ivory.dim_1920x1080.jpg",
    label: "Signature Collection",
    heading: "Kuch",
    headingAccent: "Khaas",
    subheading: "For Your Most Precious Moments",
    cta: "Explore Now",
    ctaLink: "/products",
    // Soft silver-ivory theme
    overlayFrom: "from-slate-900/50",
    overlayTo: "to-transparent",
    labelColor: "text-slate-200",
    accentColor: "from-slate-300 via-white to-slate-300",
    dotActiveColor: "bg-slate-200",
    btnBorderColor:
      "border-slate-200 text-slate-200 hover:bg-slate-200 hover:text-slate-900",
  },
  {
    bg: "/assets/generated/hero-slide-3-emerald.dim_1920x1080.jpg",
    label: "Curated Exclusives",
    heading: "Grace in",
    headingAccent: "Every Step",
    subheading: "Curated Modest Fashion for the Modern Woman",
    cta: "Discover More",
    ctaLink: "/products",
    // Deep emerald-rose theme
    overlayFrom: "from-emerald-950/60",
    overlayTo: "to-transparent",
    labelColor: "text-emerald-300",
    accentColor: "from-emerald-300 via-green-100 to-emerald-300",
    dotActiveColor: "bg-emerald-300",
    btnBorderColor:
      "border-emerald-300 text-emerald-300 hover:bg-emerald-300 hover:text-black",
  },
];

// Vastranand-style framed editorial models
const FRAMED_MODELS = [
  {
    img: "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
    name: "Scarlet Royale",
    subtitle: "Embroidered Abaya",
    price: "₹ 11,500",
    badge: "New",
    accent: "#B03A2E",
    bg: "bg-rose-50",
  },
  {
    img: "/assets/generated/editorial-abaya-blush.dim_600x900.jpg",
    name: "Blush Serenade",
    subtitle: "Pearl Embellished Abaya",
    price: "₹ 9,800",
    badge: "Bestseller",
    accent: "#C68B9A",
    bg: "bg-pink-50",
  },
  {
    img: "/assets/generated/editorial-abaya-navy.dim_600x900.jpg",
    name: "Midnight Majesty",
    subtitle: "Silver Work Abaya",
    price: "₹ 13,200",
    badge: "Limited",
    accent: "#2C3E6B",
    bg: "bg-blue-50",
  },
];

const TRUST_BADGES = [
  { icon: Scissors, label: "Artisan Made" },
  { icon: Zap, label: "Weekly Launches" },
  { icon: Gem, label: "Premium Fabrics" },
  { icon: Award, label: "Quality Stitching" },
];

const FLOAT_CLASSES = [
  "animate-float-card",
  "animate-float-card-2",
  "animate-float-card-3",
  "animate-float-card-4",
];

const FEATURED_PRODUCT = SAMPLE_PRODUCTS[1];
const FEATURED_IMAGES = [
  "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
  "/assets/generated/editorial-abaya-blush.dim_600x900.jpg",
  "/assets/generated/editorial-abaya-navy.dim_600x900.jpg",
];

export default function HomePage() {
  useScrollAnimation();
  const [slide, setSlide] = useState(0);
  const [_prevSlide, setPrevSlide] = useState<number | null>(null);
  const [featuredSize, setFeaturedSize] = useState("M");
  const [featuredImg, setFeaturedImg] = useState(0);
  const { data: products } = useAllProducts();
  const { data: testimonials } = useTestimonials();
  const sliderRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allProducts = (
    products && products.length > 0 ? products : SAMPLE_PRODUCTS
  ) as typeof SAMPLE_PRODUCTS;
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const mnkPicks = allProducts.slice(0, 4);
  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : SAMPLE_TESTIMONIALS;

  const currentSlide = HERO_SLIDES[slide];

  const startTimer = () => {
    if (sliderRef.current) clearInterval(sliderRef.current);
    sliderRef.current = setInterval(() => {
      setSlide((prev) => {
        setPrevSlide(prev);
        return (prev + 1) % HERO_SLIDES.length;
      });
    }, 5500);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: startTimer is stable (uses only refs)
  useEffect(() => {
    startTimer();
    return () => {
      if (sliderRef.current) clearInterval(sliderRef.current);
    };
  }, []);

  const goToSlide = (i: number) => {
    setPrevSlide(slide);
    setSlide(i);
    startTimer();
  };

  const handleFeaturedAddToCart = () => {
    addToCart({
      id: FEATURED_PRODUCT.id,
      name: FEATURED_PRODUCT.name,
      price: Number(FEATURED_PRODUCT.price),
      image: FEATURED_IMAGES[0],
      size: featuredSize,
      quantity: 1,
    });
    toast.success(`${FEATURED_PRODUCT.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          HERO — Full-screen, single model per slide,
          unique color palette per frame
      ═══════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", minHeight: "600px" }}
        data-ocid="hero.section"
      >
        {/* Slide backgrounds */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={`slide-bg-${s.headingAccent}`}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <div
              className={`absolute inset-0 ${i === slide ? "animate-hero-zoom" : ""}`}
              style={{
                backgroundImage: `url('${s.bg}')`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            />
            {/* Very light gradient — keep image bright and vivid */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/05 to-black/20" />
          </div>
        ))}

        {/* Arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() =>
            goToSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/60 transition-all duration-300"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goToSlide((slide + 1) % HERO_SLIDES.length)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/60 transition-all duration-300"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        {/* Center text — anti-gravity float */}
        <div className="animate-hero-float relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-8">
          {/* Season label */}
          <div className="hero-fade-1 flex items-center gap-3 mb-5">
            <div className="w-10 sm:w-14 h-px bg-white/50" />
            <span
              className={`font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.5em] ${currentSlide.labelColor} drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]`}
            >
              {currentSlide.label}
            </span>
            <div className="w-10 sm:w-14 h-px bg-white/50" />
          </div>

          {/* Main heading */}
          <h1 className="hero-fade-2 font-serif font-bold uppercase leading-[1.05] drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]">
            <span
              className="block text-white"
              style={{
                fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              {currentSlide.heading}
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(2.6rem, 9vw, 7rem)",
                letterSpacing: "0.06em",
                background: `linear-gradient(90deg, ${currentSlide.accentColor.replace("from-", "").replace("via-", "").replace("to-", "")})`,
                backgroundImage:
                  "linear-gradient(90deg, var(--tw-gradient-stops))",
              }}
            >
              {/* Use tailwind gradient class dynamically */}
              <span
                className={`bg-gradient-to-r ${currentSlide.accentColor} bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer`}
              >
                {currentSlide.headingAccent}
              </span>
            </span>
          </h1>

          {/* Ornamental divider */}
          <div className="hero-fade-3 flex items-center gap-3 my-5">
            <div className="w-12 sm:w-20 h-px bg-white/40" />
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              className="text-white/70"
            >
              <polygon
                points="6,0 7.4,4.2 12,4.2 8.3,6.8 9.7,11 6,8.4 2.3,11 3.7,6.8 0,4.2 4.6,4.2"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
            <div className="w-12 sm:w-20 h-px bg-white/40" />
          </div>

          {/* Subheading */}
          <p
            className="hero-fade-4 font-sans text-white/90 uppercase tracking-[0.35em] mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
            style={{ fontSize: "clamp(0.62rem, 1.5vw, 0.85rem)" }}
          >
            {currentSlide.subheading}
          </p>

          {/* CTA buttons */}
          <div className="hero-fade-5 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to={currentSlide.ctaLink as "/" | "/products" | "/cart"}
              data-ocid="hero.primary_button"
              className={`btn-gold-glow min-w-[180px] bg-transparent border font-sans text-[11px] uppercase tracking-[0.35em] px-10 py-4 transition-all duration-500 text-center ${currentSlide.btnBorderColor}`}
            >
              {currentSlide.cta}
            </Link>
            <a
              href="#framed-collection"
              data-ocid="hero.secondary_button"
              className="min-w-[180px] bg-transparent border border-white/50 text-white font-sans text-[11px] uppercase tracking-[0.35em] px-10 py-4 hover:bg-white/15 hover:border-white/80 transition-all duration-500 text-center"
            >
              Explore More
            </a>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={`dot-${s.headingAccent}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-400 ${i === slide ? `${s.dotActiveColor} w-8 h-2` : "bg-white/40 hover:bg-white/70 w-2 h-2"}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 opacity-60">
          <div className="w-px h-6 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      <MarqueeBanner />

      {/* ═══════════════════════════════════════════════
          VASTRANAND-STYLE FRAMED COLLECTION
          Half-model in ornate frame with background bleed
      ═══════════════════════════════════════════════ */}
      <section
        id="framed-collection"
        className="py-20 bg-[#FAF6F1] overflow-hidden"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-sans text-xs uppercase tracking-[0.5em] text-gold mb-3">
              Editorial Collection
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal uppercase tracking-wider">
              The Signature Edit
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-16 h-px bg-gold/50" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                aria-hidden="true"
                className="text-gold"
              >
                <polygon
                  points="5,0 6.2,3.5 10,3.5 7,5.7 8.1,9.2 5,7 1.9,9.2 3,5.7 0,3.5 3.8,3.5"
                  fill="currentColor"
                />
              </svg>
              <div className="w-16 h-px bg-gold/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {FRAMED_MODELS.map((model, i) => (
              <Link
                key={model.name}
                to="/products"
                data-ocid="framed_collection.link"
                className={`${FLOAT_CLASSES[i % 4]} group relative overflow-hidden rounded-none cursor-pointer block`}
              >
                {/* Clean full-bleed image — no frames */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={model.img}
                    alt={model.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient reveal on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Badge */}
                  <div
                    className="absolute top-4 right-4 z-20 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.3em] text-white"
                    style={{ backgroundColor: model.accent }}
                  >
                    {model.badge}
                  </div>
                  {/* Hover text reveal */}
                  <div className="absolute bottom-0 inset-x-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="font-serif text-xl text-white tracking-wide">
                      {model.name}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/70 mt-1">
                      {model.subtitle}
                    </p>
                    <p className="font-sans text-sm font-semibold text-gold mt-2">
                      {model.price}
                    </p>
                  </div>
                </div>
                {/* Product info below image */}
                <div className="text-center pt-5 pb-6 px-4 bg-[#FAF6F1]">
                  <p className="font-serif text-xl text-charcoal tracking-wide">
                    {model.name}
                  </p>
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-soft-gray mt-1">
                    {model.subtitle}
                  </p>
                  <p
                    className="font-sans font-semibold text-base mt-2"
                    style={{ color: model.accent }}
                  >
                    {model.price}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-charcoal border-b border-charcoal/30 pb-0.5 group-hover:border-charcoal transition-colors">
                    Shop Now <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2026 COLLECTIONS STRIP
      ═══════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto" data-animate>
        <div className="text-center mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-2">
            2026 Collections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal uppercase tracking-widest">
            Discover What&apos;s New
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              name: "MNK Picks",
              subtitle: "Hand-curated for you",
              color: "bg-charcoal",
            },
            {
              name: "Kuch Khaas",
              subtitle: "For special moments",
              color: "bg-warm-brown",
            },
            { name: "New Arrivals", subtitle: "Just landed", color: "bg-gold" },
          ].map((cat, i) => (
            <Link
              key={cat.name}
              to="/products"
              data-ocid="category.link"
              className={`group ${cat.color} ${FLOAT_CLASSES[i % 4]} relative overflow-hidden rounded-2xl border border-gold/20 p-8 flex flex-col items-center justify-center text-center min-h-[160px] hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="absolute inset-0 islamic-bg opacity-10" />
              <span className="relative font-serif text-2xl text-ivory uppercase tracking-[0.2em] group-hover:text-gold transition-colors duration-300">
                {cat.name}
              </span>
              <span className="relative font-sans text-xs text-ivory/60 tracking-widest uppercase mt-2">
                {cat.subtitle}
              </span>
              <div className="relative mt-4 w-8 h-0.5 bg-gold/50 group-hover:w-16 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEW ARRIVALS
      ═══════════════════════════════════════════════ */}
      <section className="py-14 bg-beige/30 islamic-bg" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-1">
                Fresh drops
              </p>
              <h2 className="font-serif text-3xl text-charcoal uppercase tracking-widest">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/products"
              data-ocid="new_arrivals.link"
              className="font-sans text-xs uppercase tracking-[0.25em] text-gold hover:text-gold-deep transition-colors border-b border-gold/40 pb-0.5"
            >
              View All
            </Link>
          </div>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            data-float-group
          >
            {newArrivals.map((product, i) => (
              <div key={product.id} className={FLOAT_CLASSES[i % 4]}>
                <ProductCard
                  product={product as any}
                  index={i}
                  floating={false}
                  readyToShip={i % 3 === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LOOKBOOK — CINEMATIC FULL-WIDTH STRIP
          Unique section: 3 stacked half-model editorial frames
      ═══════════════════════════════════════════════ */}
      <section
        className="py-20 bg-charcoal overflow-hidden relative"
        data-animate
      >
        <div className="absolute inset-0 islamic-bg opacity-5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-sans text-xs uppercase tracking-[0.5em] text-gold/70 mb-3">
              Season Lookbook
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-ivory uppercase tracking-wider">
              Wear Your Story
            </h2>
            <div className="w-16 h-px bg-gold/40 mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {[
              {
                img: "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
                title: "Scarlet Collection",
                year: "SS 2026",
                align: "items-start",
              },
              {
                img: "/assets/generated/lookbook-abaya-mauve.dim_600x900.jpg",
                title: "Petal Whisper",
                year: "SS 2026",
                align: "items-center",
              },
              {
                img: "/assets/generated/lookbook-abaya-emerald.dim_600x900.jpg",
                title: "Forest Elegance",
                year: "SS 2026",
                align: "items-end",
              },
            ].map((item, i) => (
              <Link
                key={item.title}
                to="/products"
                data-ocid="lookbook.link"
                className={`${FLOAT_CLASSES[i % 4]} group relative overflow-hidden`}
                style={{ aspectRatio: i === 1 ? "3/4.2" : "3/4" }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {/* Top year badge */}
                <div className="absolute top-4 left-4 font-sans text-[9px] uppercase tracking-[0.4em] text-white/60 border border-white/20 px-2 py-1">
                  {item.year}
                </div>
                {/* Bottom text */}
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="font-serif text-2xl text-ivory uppercase tracking-wide">
                    {item.title}
                  </p>
                  <div className="mt-3 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.4em] text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Collection <ArrowRight size={9} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MNK PICKS
      ═══════════════════════════════════════════════ */}
      <section className="py-14" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-1">
                Our curation
              </p>
              <h2 className="font-serif text-3xl text-charcoal uppercase tracking-widest">
                MNK Picks
              </h2>
            </div>
            <Link
              to="/products"
              data-ocid="mnk_picks.link"
              className="font-sans text-xs uppercase tracking-[0.25em] text-gold hover:text-gold-deep transition-colors border-b border-gold/40 pb-0.5"
            >
              View All
            </Link>
          </div>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            data-float-group
          >
            {mnkPicks.map((product, i) => (
              <div key={product.id} className={FLOAT_CLASSES[i % 4]}>
                <ProductCard
                  product={product as any}
                  index={i}
                  floating
                  soldOut={i === 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          UNIQUE SECTION: MOOD BOARD — 4-PANEL GRID
          Inspired by luxury brand editorial tiles
      ═══════════════════════════════════════════════ */}
      <section className="py-0 overflow-hidden" data-animate>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {[
            {
              img: "/assets/generated/hero-slide-1-gold.dim_1920x1080.jpg",
              label: "Abayas",
              color: "from-amber-900/70",
            },
            {
              img: "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
              label: "Kuch Khaas",
              color: "from-rose-900/70",
            },
            {
              img: "/assets/generated/hero-slide-2-ivory.dim_1920x1080.jpg",
              label: "Bridal",
              color: "from-slate-800/70",
            },
            {
              img: "/assets/generated/hero-slide-3-emerald.dim_1920x1080.jpg",
              label: "Zewar",
              color: "from-emerald-900/70",
            },
          ].map((tile) => (
            <Link
              key={tile.label}
              to="/products"
              data-ocid="moodboard.link"
              className="group relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={tile.img}
                alt={tile.label}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${tile.color} to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
              />
              <div className="absolute bottom-0 inset-x-0 p-5 text-center">
                <p className="font-serif text-xl sm:text-2xl text-white uppercase tracking-[0.2em]">
                  {tile.label}
                </p>
                <div className="w-8 h-0.5 bg-white/50 mx-auto mt-2 group-hover:w-16 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CUSTOMER FAVORITE — FEATURED PRODUCT
      ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-beige/40 islamic-bg" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-2">
              Best Seller
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal uppercase tracking-widest">
              Customer&apos;s Favorite
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-luxury">
                <img
                  src={FEATURED_IMAGES[featuredImg]}
                  alt="Midnight Noir Abaya Set"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
              <div className="flex gap-3 justify-center">
                {FEATURED_IMAGES.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setFeaturedImg(i)}
                    data-ocid="product.button"
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${featuredImg === i ? "border-gold" : "border-transparent"}`}
                  >
                    <img
                      src={src}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-2">
                  Modesty by Nida Khan
                </p>
                <h3 className="font-serif text-3xl font-bold text-charcoal">
                  {FEATURED_PRODUCT.name}
                </h3>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-sans font-bold text-2xl text-charcoal">
                    ₹ {Number(FEATURED_PRODUCT.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="font-sans text-xs text-soft-gray mt-1">
                  Inclusive of all taxes
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-charcoal/60 mb-2">
                  Select Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {FEATURED_PRODUCT.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      data-ocid="product.button"
                      onClick={() => setFeaturedSize(sz)}
                      className={`px-4 py-2 rounded-full border font-sans text-sm transition-all duration-200 ${featuredSize === sz ? "bg-charcoal text-ivory border-charcoal" : "border-sand text-charcoal/70 hover:border-charcoal"}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              <p className="font-sans text-sm text-soft-gray leading-relaxed">
                {FEATURED_PRODUCT.description}
              </p>
              <button
                type="button"
                onClick={handleFeaturedAddToCart}
                data-ocid="product.primary_button"
                className="w-full bg-charcoal text-ivory font-sans text-sm uppercase tracking-[0.25em] py-4 rounded-full hover:bg-warm-brown transition-colors duration-300"
              >
                Add to Cart
              </button>
              <Link
                to="/product/$id"
                params={{ id: FEATURED_PRODUCT.id }}
                data-ocid="product.secondary_button"
                className="w-full border border-charcoal text-charcoal font-sans text-sm uppercase tracking-[0.25em] py-4 rounded-full text-center hover:bg-sand transition-colors duration-300"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          UNIQUE SECTION: STYLE JOURNAL — Horizontal scroll editorial
      ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5EDE4] overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.5em] text-gold mb-2">
                Style Journal
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal uppercase tracking-wider">
                Styled by Nida
              </h2>
            </div>
            <Link
              to="/products"
              data-ocid="journal.link"
              className="hidden sm:flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-charcoal/60 hover:text-charcoal transition-colors"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
        {/* Horizontal scroll strip */}
        <div className="flex gap-5 px-4 sm:px-8 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {[
            {
              img: "/assets/generated/editorial-abaya-blush.dim_600x900.jpg",
              caption: "Blush Affair",
              tag: "Bridal Edit",
            },
            {
              img: "/assets/generated/lookbook-abaya-mauve.dim_600x900.jpg",
              caption: "Petal Dreams",
              tag: "Spring 2026",
            },
            {
              img: "/assets/generated/editorial-abaya-navy.dim_600x900.jpg",
              caption: "Midnight Allure",
              tag: "Night Collection",
            },
            {
              img: "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
              caption: "Scarlet Nights",
              tag: "Festive Edit",
            },
            {
              img: "/assets/generated/lookbook-abaya-ivory.dim_600x900.jpg",
              caption: "Velvet Elegance",
              tag: "Kuch Khaas",
            },
          ].map((item, i) => (
            <Link
              key={item.caption}
              to="/products"
              data-ocid="journal.item"
              className={`${FLOAT_CLASSES[i % 4]} group flex-none snap-start relative overflow-hidden rounded-xl bg-white shadow-luxury`}
              style={{ width: "260px" }}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
                />
              </div>
              <div className="p-4">
                <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold mb-1">
                  {item.tag}
                </p>
                <p className="font-serif text-base text-charcoal">
                  {item.caption}
                </p>
                <div className="mt-2 flex items-center gap-1 font-sans text-[9px] uppercase tracking-[0.3em] text-charcoal/50 group-hover:text-charcoal transition-colors">
                  Explore <ArrowRight size={8} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST BADGES
      ═══════════════════════════════════════════════ */}
      <section className="py-12 border-y border-sand" data-animate>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {TRUST_BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className={`${FLOAT_CLASSES[i % 4]} flex flex-col items-center gap-3`}
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Icon size={22} className="text-gold" aria-hidden="true" />
                  </div>
                  <span className="font-serif text-sm text-charcoal uppercase tracking-widest">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          UNIQUE SECTION: WISHLIST SPOTLIGHT
          Floating hearts + model images in staggered layout
      ═══════════════════════════════════════════════ */}
      <section
        className="py-20 bg-[#1A1008] overflow-hidden relative"
        data-animate
      >
        <div className="absolute inset-0 islamic-bg opacity-5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart size={14} className="text-rose-400" fill="currentColor" />
              <p className="font-sans text-xs uppercase tracking-[0.5em] text-rose-400/80">
                Most Loved
              </p>
              <Heart size={14} className="text-rose-400" fill="currentColor" />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-ivory uppercase tracking-wider">
              Wishlist Favourites
            </h2>
            <div className="w-16 h-px bg-rose-400/30 mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: "/assets/generated/lookbook-abaya-emerald.dim_600x900.jpg",
                name: "Forest Royale Abaya",
                price: "₹ 11,500",
                hearts: 248,
              },
              {
                img: "/assets/generated/editorial-abaya-burgundy.dim_600x900.jpg",
                name: "Scarlet Evening Abaya",
                price: "₹ 13,200",
                hearts: 319,
              },
              {
                img: "/assets/generated/lookbook-abaya-mauve.dim_600x900.jpg",
                name: "Lavender Bridal Abaya",
                price: "₹ 15,000",
                hearts: 412,
              },
              {
                img: "/assets/generated/editorial-abaya-blush.dim_600x900.jpg",
                name: "Blush Pearl Abaya",
                price: "₹ 9,800",
                hearts: 287,
              },
            ].map((item, i) => (
              <Link
                key={item.name}
                to="/products"
                data-ocid="wishlist.link"
                className={`${FLOAT_CLASSES[i % 4]} group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-rose-400/30 transition-all duration-500`}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-serif text-ivory text-sm leading-snug">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-sans text-gold text-sm font-semibold">
                      {item.price}
                    </p>
                    <div className="flex items-center gap-1 text-rose-400/70">
                      <Heart size={11} fill="currentColor" />
                      <span className="font-sans text-[10px]">
                        {item.hearts}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-beige/30 islamic-bg" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-2">
              Reviews
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal uppercase tracking-widest">
              What Our Clients Say
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((t, idx) => (
              <div
                key={t.name}
                data-ocid={`testimonials.item.${idx + 1}`}
                className="bg-ivory rounded-2xl p-7 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="flex gap-1 mb-4"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {["s1", "s2", "s3", "s4", "s5"]
                    .slice(0, Number(t.rating))
                    .map((k) => (
                      <Star
                        key={`${t.name}-${k}`}
                        size={14}
                        className="fill-gold text-gold"
                        aria-hidden="true"
                      />
                    ))}
                </div>
                <p
                  className="font-serif text-2xl text-gold/40 leading-none mb-3"
                  aria-hidden="true"
                >
                  &ldquo;
                </p>
                <p className="font-sans text-sm text-soft-gray leading-relaxed mb-5">
                  {t.message}
                </p>
                <div className="border-t border-sand pt-4">
                  <p className="font-serif font-semibold text-charcoal text-sm">
                    {t.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          UNIQUE SECTION: SPARKLE PROMISE STRIP
      ═══════════════════════════════════════════════ */}
      <section
        className="py-14 bg-gold/10 border-y border-gold/20"
        data-animate
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Sparkles,
                title: "Free Shipping",
                desc: "On orders above ₹ 5,000 across India",
              },
              {
                icon: Heart,
                title: "Made with Love",
                desc: "Every piece crafted by skilled artisans",
              },
              {
                icon: Award,
                title: "100% Authentic",
                desc: "Premium quality guaranteed",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`${FLOAT_CLASSES[i % 4]} flex flex-col items-center gap-3`}
                >
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                    <Icon
                      size={24}
                      className="text-gold-deep"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-serif text-lg text-charcoal">
                    {item.title}
                  </p>
                  <p className="font-sans text-xs text-soft-gray leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urdu quote divider */}
      <section className="py-16 bg-charcoal islamic-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative z-10 text-center">
          <p className="font-serif text-4xl sm:text-5xl text-gold/90 mb-4">
            لباس میں وقار
          </p>
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-ivory/60">
            Dignity in Dress
          </p>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
