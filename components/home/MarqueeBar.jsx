const LINES = [
  "SGL certified diamonds",
  "BIS hallmarked gold",
  "Cash on delivery across Nepal",
  "Free shipping on qualifying orders",
  "Easy returns at the counter",
  "Natural diamonds only",
];

export default function MarqueeBar() {
  const row = [...LINES, ...LINES];
  return (
    <div className="overflow-hidden border-y border-[#d8ba65]/40 bg-[#381c19] py-3">
      <div className="animate-marquee flex w-max text-[11px] font-medium uppercase tracking-[0.22em] text-[#e7d49a]">
        {row.map((line, i) => (
          <span key={`${line}-${i}`} className="mx-6 flex items-center gap-6">
            {line}
            <span className="h-px w-6 bg-[#ba8b30]" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
