import clientPromise from "@/lib/mongodb";

function trimDescription(text, maxLength = 160) {
  if (!text) return "";

  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 3).trim()}...`;
}

export function getItemDescription(shortDesc, longDesc, fallback) {
  return trimDescription(shortDesc || longDesc || fallback);
}

export async function getServiceBySlug(slug) {
  if (!slug) return null;

  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");
    const service = await db.collection("services").findOne({ slug, archived: false });

    if (!service) return null;

    return {
      name: service.name + " - PMV Maritime Solutions",
      shortDesc: service.shortDesc || "",
      longDesc: service.longDesc || "",
    };
  } catch {
    return null;
  }
}

export async function getProjectBySlug(slug) {
  if (!slug) return null;

  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");
    const project = await db.collection("projects").findOne({ slug, archived: false });

    if (!project) return null;

    return {
      title: project.title + " - PMV Maritime Solutions" || project.name + " - PMV Maritime Solutions" || "",
      shortDesc: project.shortDesc || project.description || "",
      longDesc: project.longDesc || "",
    };
  } catch {
    return null;
  }
}
