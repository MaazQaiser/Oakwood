const POINTS = [
  {
    title: "Independently inspected by the AA",
    body: "Not our word for it. Every car is checked by an AA engineer and the certificate is on this page.",
  },
  {
    title: "Prepared properly, not polished over",
    body: "Mechanical work by our own qualified technicians, cosmetics and valeting by a team that does nothing else.",
  },
  {
    title: "Everything handled on site afterwards",
    body: "MOT, servicing, diagnostics and mechanical work at our own workshops. You are not handed to someone else once you drive away.",
  },
  {
    title: "Over 500 cars, and finance people who know their job",
    body: "Rates from 9.4% APR, and twenty years of placing the deals other dealers hand back.",
  },
];

export function VehicleWhyOakwood() {
  return (
    <section
      aria-labelledby="why-this-oakwood-heading"
      className="relative overflow-hidden rounded-[28px] bg-[#002852] px-5 py-8 text-white md:px-8 md:py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_0%,rgba(0,156,224,0.35)_0%,rgba(0,156,224,0)_60%),linear-gradient(135deg,#001c3d_0%,#002852_55%,#0061a2_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border border-white/10"
      />
      <div className="relative">
        <p className="text-[0.75rem] font-semibold tracking-[0.08em] text-[#9fd3f2] uppercase">
          The Oakwood difference
        </p>
        <h2
          id="why-this-oakwood-heading"
          className="mt-2 text-[1.75rem] font-medium leading-[1.15em] tracking-[-0.03em] text-white sm:text-[2rem]"
        >
          Why buy this one from Oakwood
        </h2>
        <ol className="mt-7 grid gap-3 sm:grid-cols-2">
          {POINTS.map((point, index) => (
            <li
              key={point.title}
              className="rounded-[20px] bg-white/[0.07] p-5 ring-1 ring-white/15 backdrop-blur-sm"
            >
              <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-white text-sm font-semibold text-[#002852] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 block font-semibold leading-snug">{point.title}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-white/70">
                {point.body}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
