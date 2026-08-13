import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Our Services",
  description:
    "PMV Maritime Solutions Limited delivers integrated maritime services through technical expertise, operational excellence, and digital innovation for safer, smarter, and more efficient maritime operations.",
  path: "/services",
});

export default function ServicesLayout({ children }) {
  return children;
}
