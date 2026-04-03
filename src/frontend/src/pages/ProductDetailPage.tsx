import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, Minus, Package, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { IMAGES } from "../assets/images";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useAllProducts, useProductById } from "../hooks/useQueries";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { addToCart } from "../utils/cart";

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Golden Hour Ethnic Set",
    price: BigInt(8500),
    isNewArrival: true,
    description:
      "Exquisite hand-embroidered ethnic set crafted from premium lawn fabric. Features intricate gold thread work and a flattering silhouette perfect for special occasions.",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: IMAGES.productEthnicSet,
    category: "ethnicSets",
  },
  {
    id: "2",
    name: "Midnight Abaya",
    price: BigInt(12000),
    isNewArrival: false,
    description:
      "An elegant flowing abaya with hand-applied gold detailing. Cut from luxurious crepe fabric that moves gracefully with every step.",
    sizes: ["S", "M", "L"],
    imageUrl: IMAGES.productAbaya,
    category: "abayas",
  },
  {
    id: "3",
    name: "Rose Petal Maxi Dress",
    price: BigInt(7500),
    isNewArrival: true,
    description:
      "Flowing maxi dress in dusty rose with delicate floral embroidery. Modest coverage with long sleeves and a graceful hemline.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: IMAGES.productDress,
    category: "dresses",
  },
  {
    id: "4",
    name: "Pearl Essence Set",
    price: BigInt(9800),
    isNewArrival: false,
    description:
      "Pearl-toned ethnic set with intricate bead work and a beautifully structured cut.",
    sizes: ["M", "L", "XL"],
    imageUrl: IMAGES.productEthnicSet,
    category: "ethnicSets",
  },
];

const SIZE_LABELS: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
  xLarge: "XL",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
};

export default function ProductDetailPage() {
  useScrollAnimation();
  const { id } = useParams({ from: "/product/$id" });
  const { data: product, isLoading } = useProductById(id || "");
  const { data: allProducts } = useAllProducts();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const displayProduct =
    product || SAMPLE_PRODUCTS.find((p) => p.id === id) || SAMPLE_PRODUCTS[0];
  const relatedProducts = (
    allProducts && allProducts.length > 0 ? allProducts : SAMPLE_PRODUCTS
  )
    .filter((p) => {
      const cat =
        typeof p.category === "string"
          ? p.category
          : Object.keys(p.category as object)[0];
      const dispCat =
        typeof displayProduct.category === "string"
          ? displayProduct.category
          : Object.keys(displayProduct.category as object)[0];
      return cat === dispCat && p.id !== displayProduct.id;
    })
    .slice(0, 4);

  const catLabel = (() => {
    const cat =
      typeof displayProduct.category === "string"
        ? displayProduct.category
        : Object.keys(displayProduct.category as object)[0];
    if (cat === "ethnicSets") return "Ethnic Set";
    if (cat === "abayas") return "Abaya";
    return "Dress";
  })();

  const handleAddToCart = () => {
    if (!selectedSize && displayProduct.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      id: displayProduct.id,
      name: displayProduct.name,
      price: Number(displayProduct.price),
      image: displayProduct.imageUrl || IMAGES.productEthnicSet,
      size: selectedSize || String(displayProduct.sizes[0] ?? "M"),
      quantity,
    });
    toast.success(`${displayProduct.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-32 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton
            className="aspect-[3/4] rounded-2xl"
            data-ocid="product.loading_state"
          />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-6 w-1/4 rounded" />
            <Skeleton className="h-24 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 font-sans text-xs text-soft-gray mb-8 tracking-wider"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/products" className="hover:text-gold transition-colors">
            Collections
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-charcoal">{displayProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <button
            type="button"
            className={`relative overflow-hidden rounded-2xl shadow-luxury cursor-zoom-in transition-transform duration-500 w-full text-left ${
              zoomed ? "scale-105 shadow-luxury-hover" : ""
            }`}
            onClick={() => setZoomed(!zoomed)}
            onKeyDown={(e) => e.key === "Enter" && setZoomed(!zoomed)}
            aria-label="Zoom product image"
          >
            <img
              src={displayProduct.imageUrl || IMAGES.productEthnicSet}
              alt={displayProduct.name}
              className="w-full object-cover aspect-[3/4]"
            />
            {displayProduct.isNewArrival && (
              <div className="absolute top-4 left-4 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                New Arrival
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-ivory/80 backdrop-blur-sm text-charcoal text-xs px-3 py-1.5 rounded-full font-sans">
              Click to zoom
            </div>
          </button>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
                {catLabel}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mb-3 leading-tight">
              {displayProduct.name}
            </h1>

            <div
              className="flex items-center gap-1 mb-4"
              aria-label="5 out of 5 stars"
            >
              {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                <Star
                  key={k}
                  size={14}
                  className="fill-gold text-gold"
                  aria-hidden="true"
                />
              ))}
              <span className="font-sans text-xs text-soft-gray ml-2">
                (24 reviews)
              </span>
            </div>

            <div className="text-2xl font-serif font-bold text-charcoal mb-6">
              ₹ {Number(displayProduct.price).toLocaleString("en-IN")}
            </div>

            <div className="w-full h-px bg-sand mb-6" />

            {/* Size Selector */}
            {displayProduct.sizes.length > 0 && (
              <div className="mb-6">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-charcoal mb-3 font-semibold">
                  Size:{" "}
                  {selectedSize ? (
                    <span className="text-gold">
                      {SIZE_LABELS[selectedSize] || selectedSize}
                    </span>
                  ) : (
                    <span className="text-soft-gray">Select</span>
                  )}
                </p>
                <div
                  className="flex flex-wrap gap-2"
                  data-ocid="product.select"
                >
                  {displayProduct.sizes.map((size) => (
                    <button
                      key={String(size)}
                      type="button"
                      onClick={() => setSelectedSize(String(size))}
                      className={`min-w-[3rem] h-10 px-3 rounded-lg font-sans text-sm font-medium border transition-all duration-200 ${
                        selectedSize === String(size)
                          ? "bg-gold border-gold-deep text-charcoal shadow-gold"
                          : "border-sand bg-ivory text-charcoal/70 hover:border-gold hover:text-charcoal"
                      }`}
                    >
                      {SIZE_LABELS[String(size)] || String(size)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-charcoal mb-3 font-semibold">
                Quantity
              </p>
              <div className="flex items-center border border-sand rounded-xl overflow-hidden w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-ocid="product.secondary_button"
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-sand/50 transition-colors"
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-12 text-center font-sans text-sm font-semibold text-charcoal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  data-ocid="product.primary_button"
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-sand/50 transition-colors"
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              data-ocid="product.submit_button"
              className="w-full bg-gold text-charcoal font-sans font-bold text-sm uppercase tracking-[0.3em] py-4 rounded-xl hover:bg-gold-deep hover:shadow-gold transition-all duration-300 hover:-translate-y-0.5 mb-4"
            >
              Add to Cart
            </button>

            <div className="flex items-center justify-center gap-2 text-soft-gray mb-8">
              <Package size={14} aria-hidden="true" />
              <span className="font-sans text-xs">
                Free shipping on orders above ₹ 5,000
              </span>
            </div>

            <Accordion
              type="single"
              collapsible
              className="border-t border-sand"
            >
              <AccordionItem value="description" className="border-sand">
                <AccordionTrigger className="font-sans text-sm font-semibold text-charcoal uppercase tracking-widest hover:text-gold hover:no-underline">
                  Description
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm text-soft-gray leading-relaxed">
                  {displayProduct.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care" className="border-sand">
                <AccordionTrigger className="font-sans text-sm font-semibold text-charcoal uppercase tracking-widest hover:text-gold hover:no-underline">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm text-soft-gray leading-relaxed">
                  Hand wash in cold water with mild detergent. Lay flat to dry.
                  Do not tumble dry or bleach. Iron on low heat inside out.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="shipping"
                className="border-b-0 border-sand"
              >
                <AccordionTrigger className="font-sans text-sm font-semibold text-charcoal uppercase tracking-widest hover:text-gold hover:no-underline">
                  Shipping &amp; Returns
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm text-soft-gray leading-relaxed">
                  Standard delivery across India: 3–5 business days. Express
                  available. Free returns within 7 days of delivery for unused
                  items in original condition.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20" data-animate>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal text-center uppercase tracking-widest mb-3">
              You May Also Like
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-10" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p as any}
                  index={i}
                  floating={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
