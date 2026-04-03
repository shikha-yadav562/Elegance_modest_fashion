import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { addToCart } from "../utils/cart";

interface Props {
  product: Product;
  index?: number;
  floating?: boolean;
  soldOut?: boolean;
  readyToShip?: boolean;
  hoverImage?: string;
}

export default function ProductCard({
  product,
  index = 0,
  floating = true,
  soldOut = false,
  readyToShip = false,
  hoverImage,
}: Props) {
  const delay = index * 0.5;
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [hovered, setHovered] = useState(false);

  const cat =
    typeof product.category === "string"
      ? product.category
      : Object.keys(product.category as object)[0];

  const imageUrl =
    product.imageUrl ||
    (cat === "abayas"
      ? "/assets/generated/product-abaya.dim_600x800.jpg"
      : cat === "dresses"
        ? "/assets/generated/product-dress.dim_600x800.jpg"
        : "/assets/generated/product-ethnic-set.dim_600x800.jpg");

  const secondImage = hoverImage || imageUrl;

  const handleAddToCart = () => {
    if (soldOut) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: imageUrl,
      size: selectedSize || String(product.sizes[0] ?? "M"),
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const sizes =
    product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL", "XXL"];

  return (
    <div
      className="group relative bg-ivory rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 hover:-translate-y-2 flex flex-col"
      style={
        floating
          ? { animation: `float 4s ease-in-out ${delay}s infinite` }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
        {soldOut && (
          <span className="bg-charcoal/80 text-ivory text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Sold Out
          </span>
        )}
        {readyToShip && (
          <span className="bg-green-600 text-ivory text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Ready to Ship
          </span>
        )}
        {product.isNewArrival && !soldOut && (
          <span className="bg-gold text-charcoal text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            New
          </span>
        )}
      </div>

      {/* Image with hover swap */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={hovered ? secondImage : imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500"
        />
        {soldOut && (
          <div className="absolute inset-0 bg-ivory/40 flex items-center justify-center">
            <span className="font-serif text-charcoal/60 text-lg uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
        {!soldOut && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Link
              to="/product/$id"
              params={{ id: product.id }}
              className="block w-full text-center bg-charcoal/90 text-ivory font-sans text-[10px] uppercase tracking-[0.25em] py-2.5 hover:bg-charcoal transition-colors"
            >
              Quick View
            </Link>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="font-serif text-sm font-medium text-charcoal leading-snug">
          {product.name}
        </h3>
        <span className="font-sans font-semibold text-charcoal text-sm">
          ₹ {Number(product.price).toLocaleString("en-IN")}
        </span>

        {/* Size selector */}
        <div className="flex flex-wrap gap-1 mt-0.5">
          {sizes.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(sz)}
              className={`text-[9px] font-sans uppercase px-2 py-0.5 rounded-full border transition-colors duration-150 ${
                selectedSize === sz
                  ? "bg-charcoal text-ivory border-charcoal"
                  : "border-sand text-charcoal/70 hover:border-charcoal/50"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={soldOut}
            data-ocid="product.button"
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 bg-sand/60 hover:bg-gold text-charcoal text-[10px] font-sans uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={11} aria-hidden="true" /> Add
          </button>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            data-ocid="product.button"
            className="flex-1 text-center bg-charcoal text-ivory text-[10px] font-sans uppercase tracking-wider py-1.5 rounded-full hover:bg-warm-brown transition-colors duration-200"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
