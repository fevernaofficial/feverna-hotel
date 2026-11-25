import type { Metadata } from "next";
import SolariumExperience from "../components/SolariumExperience";

export const metadata: Metadata = {
  title: "Solarium | Hotel Feverna",
  description:
    "Visit the Solarium at Hotel Feverna, a sunlit room with a central fountain, wicker seating, and windows overlooking the sea.",
};

export default function SolariumPage() {
  return <SolariumExperience />;
}
