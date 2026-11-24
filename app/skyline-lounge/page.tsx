import type { Metadata } from "next";
import SkylineLoungeExperience from "../components/SkylineLoungeExperience";

export const metadata: Metadata = {
  title: "Skyline Lounge | Hotel Feverna",
  description:
    "Visit the rainlit Skyline Lounge of Hotel Feverna and look out across the city.",
};

export default function SkylineLoungePage() {
  return <SkylineLoungeExperience />;
}
