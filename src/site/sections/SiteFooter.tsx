export default function SiteFooter() {
  return (
    <footer className="border-t border-hair/60 bg-white/50">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-12 text-center">
        <p className="text-sm leading-relaxed text-muted">
          Cet assistant ne remplace pas un avis médical. Pour toute situation
          urgente ou inquiétante, consulte un professionnel de santé ou le centre
          de santé le plus proche.
        </p>
        <p className="text-xs leading-relaxed text-muted/80">
          Ce projet accompagne un mémoire de fin d'études en soins infirmiers :
          « Les pratiques éducatives des infirmiers pour la prévention des IST
          chez les adolescents ».
        </p>
      </div>
    </footer>
  );
}
