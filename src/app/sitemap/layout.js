import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Sitemap",
  description:
    "Browse the complete sitemap of PMV Maritime Solutions — services, projects, about us, careers, contact, FAQs, gallery, and legal pages.",
  path: "/sitemap",
});

export default function SitemapLayout({ children }) {
  return children;
}
