"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Props {
  onReplay: () => void;
}

interface Product {
  id: number;
  name: string;
  price: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Neural Kit", price: "$49", color: "text-emerald-400", bgColor: "bg-emerald-400/10", borderColor: "border-emerald-400/30", icon: "◇" },
  { id: 2, name: "Core SDK", price: "$29", color: "text-cyan-400", bgColor: "bg-cyan-400/10", borderColor: "border-cyan-400/30", icon: "⬡" },
  { id: 3, name: "Vision Pro", price: "$99", color: "text-violet-400", bgColor: "bg-violet-400/10", borderColor: "border-violet-400/30", icon: "◈" },
  { id: 4, name: "Data Pack", price: "$39", color: "text-amber-400", bgColor: "bg-amber-400/10", borderColor: "border-amber-400/30", icon: "◆" },
  { id: 5, name: "Edge API", price: "$59", color: "text-emerald-400", bgColor: "bg-emerald-400/10", borderColor: "border-emerald-400/30", icon: "⊞" },
  { id: 6, name: "Flux UI", price: "$79", color: "text-cyan-400", bgColor: "bg-cyan-400/10", borderColor: "border-cyan-400/30", icon: "◉" },
];

export function FlipAddToCart({ onReplay }: Props) {
  void onReplay;
  const containerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);

  useGSAP(
    (_, contextSafe) => {
      const container = containerRef.current;
      const cart = cartRef.current;
      if (!container || !cart) return;

      // Entry animation
      gsap.from(".cart-product", {
        y: 30,
        opacity: 0,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(1.4)",
        delay: 0.3,
      });

      gsap.from(".cart-indicator", {
        scale: 0,
        duration: 0.4,
        ease: "back.out(2)",
        delay: 0.8,
      });

      // Track state inside the hook — no React state needed for the loop
      const added = new Set<number>();
      let count = 0;

      // contextSafe so any GSAP created inside is tracked by the context
      const flyToCart = contextSafe!((productId: number) => {
        const productEl = container.querySelector(
          `[data-product-id="${productId}"]`,
        ) as HTMLElement | null;
        if (!productEl) return;

        const productRect = productEl.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();

        // Create a flying dot — position: fixed so it's relative to viewport
        const dot = document.createElement("div");
        const borderColor = getComputedStyle(productEl).borderColor;
        dot.style.cssText = [
          "position: fixed",
          "pointer-events: none",
          "border-radius: 50%",
          "z-index: 9999",
          `width: 20px`,
          `height: 20px`,
          `left: ${productRect.left + productRect.width / 2 - 10}px`,
          `top: ${productRect.top + productRect.height / 2 - 10}px`,
          `background: ${borderColor}`,
          `box-shadow: 0 0 16px ${borderColor}`,
        ].join(";");
        document.body.appendChild(dot);

        // Pulse the original card
        gsap.to(productEl, {
          scale: 0.92,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            gsap.to(productEl, { scale: 1, opacity: 0.35, duration: 0.3, ease: "power2.out" });
          },
        });

        // Calculate delta from dot's fixed position to cart center
        const dx = (cartRect.left + cartRect.width / 2) - (productRect.left + productRect.width / 2);
        const dy = (cartRect.top + cartRect.height / 2) - (productRect.top + productRect.height / 2);

        // Fly to cart
        gsap.to(dot, {
          x: dx,
          y: dy,
          scale: 0.3,
          opacity: 0.6,
          duration: 0.55,
          ease: "power3.in",
          onComplete: () => {
            dot.remove();
            count++;
            setCartCount(count);

            // Bounce the badge
            const badge = cart.querySelector(".cart-badge");
            if (badge) {
              gsap.fromTo(
                badge,
                { scale: 1.8 },
                { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" },
              );
            }
          },
        });
      });

      // Auto-demo loop using gsap.delayedCall (auto-cleaned by context)
      function scheduleNext() {
        gsap.delayedCall(1.2, () => {
          const available = PRODUCTS.filter((p) => !added.has(p.id));

          if (available.length === 0) {
            // All added — pause, then reset
            gsap.delayedCall(1.5, () => {
              added.clear();
              count = 0;
              setCartCount(0);

              // Restore all cards
              gsap.to(".cart-product", {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: "back.out(1.4)",
                onComplete: () => {
                  gsap.delayedCall(1.0, scheduleNext);
                },
              });
            });
            return;
          }

          // Pick random available product
          const pick = available[Math.floor(Math.random() * available.length)];
          added.add(pick.id);
          flyToCart(pick.id);

          scheduleNext();
        });
      }

      // Kick off after entry animation settles
      gsap.delayedCall(1.5, scheduleNext);
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center h-full p-8"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-xl">
        <p className="text-xs font-mono text-zinc-500">
          auto-demo · colored dot flies to cart · elastic badge bounce
        </p>

        {/* Cart indicator */}
        <div className="w-full flex justify-end">
          <div
            ref={cartRef}
            className="cart-indicator relative flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50"
          >
            <span className="text-sm">🛒</span>
            <span className="text-xs font-mono text-zinc-400">Cart</span>
            <span className="cart-badge inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold">
              {cartCount}
            </span>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              data-product-id={product.id}
              className={`cart-product rounded-xl ${product.bgColor} border ${product.borderColor} p-4 flex flex-col items-center justify-center gap-2 aspect-[4/5]`}
            >
              <span className={`text-3xl ${product.color}`}>{product.icon}</span>
              <span className={`text-xs font-mono ${product.color} font-medium`}>
                {product.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {product.price}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-600">
          position:fixed dot · gsap x/y delta · delayedCall loop · context-safe cleanup
        </p>
      </div>
    </div>
  );
}
