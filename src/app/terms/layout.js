import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Terms & Conditions",
  description:
    "Welcome to PMV Maritime Solutions Limited. By accessing or using this website, you agree to comply with and be bound by our Terms & Conditions.",
  path: "/terms",
});

export default function TermsLayout({ children }) {
  return children;
}
