export const metadata = {
  title: "Gift Shop | Hotel Feverna",
  description: "Relics and curios from the halls of Feverna.",
};

export default function GiftShop() {
  return (
    <main
      className="min-h-screen flex items-end justify-center pb-10 text-fevernaGold"
      style={{
        backgroundImage: "url('/images/giftshop.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/60 p-8 rounded text-center">
        <h2 className="text-2xl mb-4 font-serif">Gift Shop</h2>
        <p className="text-lg mb-2">Closed for Renovations</p>
        <a href="/" className="underline hover:text-white">
          Return to Lobby
        </a>
      </div>
    </main>
  );
}
