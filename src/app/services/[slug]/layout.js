import { createPageMetadata } from "@/lib/pageMetadata";
import { getItemDescription, getServiceBySlug } from "@/lib/content";

const FALLBACK_DESCRIPTION =
  "PMV Maritime Solutions Limited delivers integrated maritime services through technical expertise, operational excellence, and digital innovation.";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return createPageMetadata({
      title: "Service Not Found",
      description: FALLBACK_DESCRIPTION,
      path: `/services/${slug}`,
    });
  }

  return createPageMetadata({
    title: service.name,
    description: getItemDescription(service.shortDesc, service.longDesc, FALLBACK_DESCRIPTION),
    path: `/services/${slug}`,
  });
}

export default function ServiceSlugLayout({ children }) {
  return children;
}
