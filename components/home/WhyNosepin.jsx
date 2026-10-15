const TRUST_ITEMS = [
  { title: "Genuine stones", text: "Natural diamonds, SGL certified. No lab-grown mix on the tray." },
  { title: "Hallmarked gold", text: "BIS-marked pieces, weighed and billed the way a jeweller should." },
  { title: "Pay at the door", text: "Cash on delivery across Nepal, or settle online if you prefer." },
  { title: "Bring it back", text: "Returns are handled at the counter — not a maze of tickets." },
];

export default function WhyNosepin() {
  return (
    <section className="w-full bg-[#381c19] py-14 text-[#fbf6ee] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e7d49a]">
          How we sell
        </p>
        <h2 className="mt-2 max-w-xl font-serif text-3xl sm:text-4xl">
          A jeweller in Kathmandu, not a catalogue with a checkout.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="border-t border-[#ba8b30]/40 pt-4">
              <h3 className="font-serif text-lg text-[#e7d49a]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#eadbd6]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
