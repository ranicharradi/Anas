const CARDS = [
  {
    title: "Se protéger",
    body: "Le préservatif reste le moyen le plus simple et efficace de se protéger des IST, à chaque rapport.",
  },
  {
    title: "Se faire dépister",
    body: "Beaucoup d'IST ne donnent aucun signe. Le dépistage est le seul moyen d'être sûr·e, et il est confidentiel.",
  },
  {
    title: "En parler",
    body: "Poser ses questions, en parler à un·e soignant·e ou à son ou sa partenaire, c'est déjà se protéger.",
  },
];

export default function Essentiel() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="reveal text-center font-display text-4xl font-light text-ink">
        L'essentiel
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="reveal rounded-3xl border border-hair/60 bg-white/70 p-7 shadow-[0_20px_60px_rgba(27,29,36,0.08)]"
          >
            <span className="block h-1 w-12 rounded-full bg-coral" aria-hidden />
            <h3 className="mt-5 font-display text-2xl font-light text-ink">{c.title}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-muted">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
