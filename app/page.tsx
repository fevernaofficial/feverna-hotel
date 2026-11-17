import type { Metadata } from "next";
import GrandLobbyExperience from "./components/GrandLobbyExperience";

export const metadata: Metadata = {
  title: "Grand Lobby | Hotel Feverna",
  description:
    "Enter the Grand Lobby of Hotel Feverna and approach the reception desk.",
};

export default function Lobby() {
  return <GrandLobbyExperience />;
}
