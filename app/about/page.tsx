export const metadata = {
  title: "About Feverna | Hotel Feverna",
  description: "The vision and mythos of Feverna.",
};

export default function About() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center p-8 bg-black/90">
      <div className="max-w-2xl">
        <h1 className="text-3xl mb-6">About Feverna</h1>
        <p className="text-lg leading-relaxed mb-4">
          <strong>Feverna</strong> is a mythic world where longing, beauty, and
          memory intertwine. It began as a musical project and has grown into a
          living narrative—an invitation to linger in the quiet ache that
          resides between desire and devotion.
        </p>
        <p className="text-lg leading-relaxed">
          This site, the <em>Hotel Feverna</em>, serves as both sanctuary and
          archive: each room reveals a fragment of her story. Visitors are
          welcome to wander, to listen, and to remember what it feels like to be
          moved by something just out of reach.
        </p>
      </div>
    </main>
  );
}
