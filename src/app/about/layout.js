import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "PMV Maritime is a global maritime leader with 20+ years of experience in port operations, fleet management, and logistics consultancy. We combine technical precision with visionary management to curate the flow of global commerce with a commitment to sustainability and digital-first operations.",
  path: "/about",
});

export default function AboutLayout({ children }) {
  return children;
}
