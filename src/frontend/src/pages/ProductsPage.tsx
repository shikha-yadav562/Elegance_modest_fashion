import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useAllProducts } from "../hooks/useQueries";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "ethnicSets", label: "Ethnic Sets" },
  { value: "abayas", label: "Abayas" },
  { value: "dresses", label: "Dresses" },
];

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Golden Hour Ethnic Set",
    price: BigInt(8500),
    isNewArrival: true,
    description: "Exquisite embroidered ethnic set",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "/assets/generated/product-ethnic-set.dim_600x800.jpg",
    category: "ethnicSets",
  },
  {
    id: "2",
    name: "Midnight Abaya",
    price: BigInt(12000),
    isNewArrival: false,
    description: "Flowing abaya with gold detailing",
    sizes: ["S", "M", "L"],
    imageUrl: "/assets/generated/product-abaya.dim_600x800.jpg",
    category: "abayas",
  },
  {
    id: "3",
    name: "Rose Petal Maxi Dress",
    price: BigInt(7500),
    isNewArrival: true,
    description: "Elegant modest maxi dress",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "/assets/generated/product-dress.dim_600x800.jpg",
    category: "dresses",
  },
  {
    id: "4",
    name: "Pearl Essence Set",
    price: BigInt(9800),
    isNewArrival: false,
    description: "Premium pearl-toned ethnic set",
    sizes: ["M", "L", "XL"],
    imageUrl: "/assets/generated/product-ethnic-set.dim_600x800.jpg",
    category: "ethnicSets",
  },
  {
    id: "5",
    name: "Ivory Breeze Abaya",
    price: BigInt(11000),
    isNewArrival: true,
    description: "Lightweight ivory abaya for everyday elegance",
    sizes: ["S", "M", "L"],
    imageUrl: "/assets/generated/product-abaya.dim_600x800.jpg",
    category: "abayas",
  },
  {
    id: "6",
    name: "Ember Kurta Set",
    price: BigInt(6500),
    isNewArrival: false,
    description: "Warm-toned embroidered kurta",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "/assets/generated/product-ethnic-set.dim_600x800.jpg",
    category: "ethnicSets",
  },
  {
    id: "7",
    name: "Sage Garden Dress",
    price: BigInt(8200),
    isNewArrival: false,
    description: "Floral sage modest dress",
    sizes: ["M", "L", "XL"],
    imageUrl: "/assets/generated/product-dress.dim_600x800.jpg",
    category: "dresses",
  },
  {
    id: "8",
    name: "Royal Velvet Abaya",
    price: BigInt(15000),
    isNewArrival: true,
    description: "Luxurious velvet abaya for special occasions",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "/assets/generated/product-abaya.dim_600x800.jpg",
    category: "abayas",
  },
];

export default function ProductsPage() {
  useScrollAnimation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: products, isLoading } = useAllProducts();
  const allProducts =
    products && products.length > 0 ? products : SAMPLE_PRODUCTS;

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const cat =
        typeof p.category === "string"
          ? p.category
          : Object.keys(p.category as object)[0];
      const catMatch = selectedCategory === "all" || cat === selectedCategory;
      const priceMatch =
        Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1];
      return catMatch && priceMatch;
    });
  }, [allProducts, selectedCategory, priceRange]);

  const SidebarContent = () => (
    <aside className="space-y-8">
      <div>
        <h3 className="font-serif font-semibold text-charcoal uppercase tracking-widest text-sm mb-4">
          Category
        </h3>
        <ul className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                type="button"
                data-ocid={`filter.${cat.value}.button`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`w-full text-left font-sans text-sm transition-colors px-3 py-1.5 rounded-lg ${
                  selectedCategory === cat.value
                    ? "bg-gold/20 text-charcoal font-semibold border-l-2 border-gold pl-4"
                    : "text-soft-gray hover:text-charcoal hover:bg-sand/50"
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-serif font-semibold text-charcoal uppercase tracking-widest text-sm mb-4">
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between font-sans text-xs text-soft-gray">
            <span>₹ {priceRange[0].toLocaleString("en-IN")}</span>
            <span>₹ {priceRange[1].toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={20000}
            step={500}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-gold"
            data-ocid="filter.price.input"
          />
        </div>
      </div>
      <div>
        <h3 className="font-serif font-semibold text-charcoal uppercase tracking-widest text-sm mb-4">
          New Arrivals
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-gold"
            data-ocid="filter.new.checkbox"
          />
          <span className="font-sans text-sm text-soft-gray">
            Show only new
          </span>
        </label>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <div className="pt-28 pb-10 bg-sand/30 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-2">
          Browse
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal uppercase tracking-widest">
          All Collections
        </h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-ocid="filter.toggle.button"
            className="flex items-center gap-2 font-sans text-sm text-charcoal border border-sand rounded-full px-4 py-2"
          >
            <SlidersHorizontal size={14} aria-hidden="true" /> Filters
          </button>
          <span className="font-sans text-xs text-soft-gray">
            {filtered.length} items
          </span>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-charcoal/40 w-full h-full cursor-default"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close filters"
            />
            <dialog
              open
              aria-label="Filters"
              className="absolute left-0 top-0 bottom-0 w-72 bg-ivory p-6 overflow-y-auto shadow-xl m-0 max-h-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-semibold text-charcoal text-lg">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  data-ocid="filter.close.button"
                  aria-label="Close"
                >
                  <X size={20} className="text-charcoal" aria-hidden="true" />
                </button>
              </div>
              <SidebarContent />
            </dialog>
          </div>
        )}

        <div className="flex gap-10">
          <div className="hidden md:block w-56 shrink-0">
            <SidebarContent />
          </div>

          <div className="flex-1">
            <div className="hidden md:flex items-center justify-between mb-6">
              <span className="font-sans text-xs text-soft-gray tracking-widest">
                {filtered.length} ITEMS
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
                  <Skeleton
                    key={k}
                    className="aspect-[3/4] rounded-2xl"
                    data-ocid="products.loading_state"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="products.empty_state"
              >
                <p className="font-serif text-2xl text-charcoal/40 mb-4">
                  No products found
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="font-sans text-sm text-gold hover:text-gold-deep transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
                data-animate
              >
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    index={i}
                    floating={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export { Link };
