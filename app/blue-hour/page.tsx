import type { Metadata } from "next";
import BlueHourExperience from "../components/BlueHourExperience";

export const metadata: Metadata = {
  title: "The Blue Hour | Hotel Feverna",
  description:
    "Enter The Blue Hour, an intimate performance room adjoining Hotel Feverna's Skyline Lounge.",
};

export default function BlueHourPage() {
  return <BlueHourExperience />;
}
