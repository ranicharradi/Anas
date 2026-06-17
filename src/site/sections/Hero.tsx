export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[88vh] max-w-3xl flex-col justify-center px-6 py-20 text-center">
      <p className="reveal mono-label text-coral">Prévention des IST · pour les ados</p>
      <h1 className="reveal mt-5 font-display text-5xl font-light leading-[1.05] text-ink sm:text-6xl">
        Tes questions sur les IST, sans tabou.
      </h1>
      <p className="reveal mx-auto mt-6 max-w-xl text-xl leading-relaxed text-muted">
        Pose ta question à un assistant pensé pour toi. C'est anonyme,
        confidentiel, et sans jugement.
      </p>
      <div className="reveal mt-9 flex flex-col items-center gap-5">
        <a
          href="#assistant"
          className="rounded-full bg-coral px-8 py-4 text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          Poser une question
        </a>
        <div className="flex flex-wrap justify-center gap-2">
          {["Anonyme", "Confidentiel", "Sans jugement"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-hair/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-ink/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
