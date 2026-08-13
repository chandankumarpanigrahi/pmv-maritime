import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with PMV Maritime. With offices and partners across 6+ countries, we provide global support, quick response times, and maritime excellence wherever you need us.",
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
