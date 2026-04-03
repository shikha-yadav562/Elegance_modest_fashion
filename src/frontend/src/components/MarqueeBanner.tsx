import { Gift, Percent, Sparkles, Star, Tag, Truck } from "lucide-react";

const items = [
  { icon: Percent, text: "Flat 15% OFF on New Arrivals — Use Code: MNK15" },
  { icon: Tag, text: "Festive Sale: Up to 40% OFF on Select Abayas" },
  { icon: Truck, text: "Free Shipping across India on orders above ₹5,000" },
  { icon: Gift, text: "Eid Special Combos — Shop & Save More" },
  { icon: Star, text: "New Collection Drops Every Friday — Don't Miss Out!" },
  { icon: Sparkles, text: "WhatsApp us: +91 98765 43210 for Custom Orders" },
];

// Repeat 3x for seamless scroll; keys include repetition index to avoid duplicates
const repeated = [
  ...items.map((item) => ({ ...item, _k: `a-${item.text}` })),
  ...items.map((item) => ({ ...item, _k: `b-${item.text}` })),
  ...items.map((item) => ({ ...item, _k: `c-${item.text}` })),
];

export default function MarqueeBanner() {
  return (
    <div
      className="bg-[#2a1f0e] border-y border-amber-900/40 overflow-hidden py-2.5"
      aria-label="Announcement marquee"
    >
      <div className="animate-marquee flex gap-0">
        {repeated.map((item) => {
          const Icon = item.icon;
          return (
            <span
              key={item._k}
              className="flex items-center gap-2 text-xs font-sans text-amber-100/90 tracking-widest uppercase whitespace-nowrap px-8"
            >
              <Icon
                size={12}
                className="text-gold shrink-0"
                aria-hidden="true"
              />
              {item.text}
              <span className="ml-4 text-gold/40">✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
