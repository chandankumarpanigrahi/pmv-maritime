import { createPageMetadata } from "@/lib/pageMetadata";
import { getItemDescription, getProjectBySlug } from "@/lib/content";

const FALLBACK_DESCRIPTION =
  "Explore how PMV Maritime Solutions delivers projects through technical expertise, digital innovation, industry knowledge, and disciplined execution across the global maritime sector.";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: "Project Not Found",
      description: FALLBACK_DESCRIPTION,
      path: `/projects/${slug}`,
    });
  }

  return createPageMetadata({
    title: project.title,
    description: getItemDescription(project.shortDesc, project.longDesc, FALLBACK_DESCRIPTION),
    path: `/projects/${slug}`,
  });
}

export default function ProjectSlugLayout({ children }) {
  return children;
}
