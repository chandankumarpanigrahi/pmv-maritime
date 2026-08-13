import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Our Projects",
  description:
    "Explore how PMV Maritime Solutions delivers projects through technical expertise, digital innovation, industry knowledge, and disciplined execution across the global maritime sector.",
  path: "/projects",
});

export default function ProjectsLayout({ children }) {
  return children;
}
