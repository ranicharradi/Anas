const POINTS = [
  {
    q: "Pourquoi ?",
    a: "Beaucoup d'IST sont silencieuses : on peut en avoir une sans aucun symptôme. Le dépistage est le seul moyen de savoir.",
  },
  {
    q: "Quand ?",
    a: "Après un rapport non protégé, un changement de partenaire, ou simplement par précaution. Il n'est jamais trop tôt pour demander.",
  },
  {
    q: "C'est confidentiel ?",
    a: "Oui. Le dépistage se fait auprès d'un professionnel de santé, en toute confidentialité.",
  },
];

export default function Depistage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="reveal text-center font-display text-4xl font-light text-ink">
        Le dépistage, simplement
      </h2>
      <dl className="mt-12 space-y-8">
        {POINTS.map((p) => (
          <div key={p.q} className="reveal border-l-[3px] border-coral pl-6">
            <dt className="font-display text-2xl font-light text-coral">{p.q}</dt>
            <dd className="mt-2 text-[18px] leading-relaxed text-ink/85">{p.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
