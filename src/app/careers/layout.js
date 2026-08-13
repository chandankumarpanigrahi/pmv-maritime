import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Careers",
  description:
    "At PMV Maritime, we believe our people are our greatest strength. Whether at sea or on shore, we empower our teams to grow, collaborate, and make a real impact in the maritime industry.",
  path: "/careers",
});

export default function CareersLayout({ children }) {
  return children;
}
