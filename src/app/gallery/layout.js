import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Gallery",
  description:
    "Explore our maritime fleet, offshore operations, vessel surveys, and seafarer training in high-definition visual imagery from PMV Maritime.",
  path: "/gallery",
});

export default function GalleryLayout({ children }) {
  return children;
}
