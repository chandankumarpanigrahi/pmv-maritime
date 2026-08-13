import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "At PMV Maritime Solutions Limited, we respect your privacy and are committed to protecting the personal information you share with us. Learn how we collect, use, store, and protect your information.",
  path: "/privacy",
});

export default function PrivacyLayout({ children }) {
  return children;
}
