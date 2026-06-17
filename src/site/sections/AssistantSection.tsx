import ChatBox from "@/site/components/ChatBox";

const SUGGESTIONS = [
  "C'est quoi une IST ?",
  "Où me faire dépister ?",
  "Le préservatif, ça suffit ?",
  "Comment en parler à mon ou ma partenaire ?",
];

export default function AssistantSection() {
  return (
    <section id="assistant" className="mx-auto max-w-2xl px-6 py-20">
      <p className="reveal mono-label text-center text-coral">L'assistant</p>
      <h2 className="reveal mt-4 text-center font-display text-4xl font-light text-ink">
        Demande, on te répond simplement.
      </h2>
      <div className="reveal mt-10">
        <ChatBox suggestions={SUGGESTIONS} />
      </div>
    </section>
  );
}
