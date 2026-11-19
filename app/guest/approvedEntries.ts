export type ApprovedVisitorEntry = {
  id: string;
  quotation: string;
  name: string;
  location: string;
};

// Only manually reviewed, approved entries belong in this file. Submission
// emails are never published automatically.
export const approvedVisitorEntries = [
  {
    id: "abby-solarium",
    quotation: "“I wanted to be held a little bit longer.”",
    name: "Abby",
    location: "Solarium",
  },
] as const satisfies readonly ApprovedVisitorEntry[];
