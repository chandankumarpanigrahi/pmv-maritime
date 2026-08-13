import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Copyrights",
  description:
    "© 2026 PMV Maritime Solutions Limited. All Rights Reserved. All content on this website is protected by applicable copyright and intellectual property laws.",
  path: "/copyright",
});

export default function CopyrightLayout({ children }) {
  return children;
}
