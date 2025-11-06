export const metadata = {
  title: "The Caretaker | Hotel Feverna",
  description: "The curator and keeper of Hotel Feverna.",
};

export default function Caretaker() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center p-8 bg-black/90">
      <div className="max-w-2xl">
        <h1 className="text-3xl mb-6">The Caretaker</h1>
        <p className="text-lg leading-relaxed mb-4">
          I am the keeper of this house, the one who tends to its lights and
          remembers what was left behind.  My duty is not to speak for Her, but
          to keep the rooms ready for those who still come seeking.
        </p>
        <p className="text-lg leading-relaxed">
          Every guest brings their own shadow.  Every story leaves a trace.
          When you depart, know that your presence lingers—softly, and without
          regret.
        </p>
      </div>
    </main>
  );
}
