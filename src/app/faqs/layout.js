import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "FAQs",
  description:
    "Find authoritative answers to common questions about PMV Maritime Solutions's port infrastructure, fleet technical management, maritime consultancy, shipbuilding, digitisation, and regulatory compliance solutions.",
  path: "/faqs",
});

export default function FaqsLayout({ children }) {
  return children;
}
