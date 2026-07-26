import { TileCalculator } from "@/components/TileCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tile Calculator",
  description:
    "Calculate how many square metres of tiles you need, including wastage, and estimate cost.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Plan smart</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Tile Calculator</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Enter your room dimensions and we&apos;ll calculate how many square meters of tiles you need
        — including the recommended extra for cuts and breakages.
      </p>
      <div className="mt-10">
        <TileCalculator />
      </div>
    </div>
  );
}
