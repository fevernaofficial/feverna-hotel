import type { Metadata } from "next";
import SkylineLoungeExperience from "../components/SkylineLoungeExperience";

export const metadata: Metadata = {
  title: "Skyline Lounge | Hotel Feverna",
  description:
    "Visit the rainlit Skyline Lounge of Hotel Feverna and look out across the city.",
};

export default async function SkylineLoungePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return (
    <SkylineLoungeExperience
      initialView={view === "arrival" ? "arrival" : "lounge"}
    />
  );
}
