import type { Metadata } from "next";
import LibraryExperience from "../components/LibraryExperience";

export const metadata: Metadata = {
  title: "Library | Hotel Feverna",
  description:
    "Enter the quiet library of Hotel Feverna and remain as long as you wish.",
};

export default function LibraryPage() {
  return <LibraryExperience />;
}
