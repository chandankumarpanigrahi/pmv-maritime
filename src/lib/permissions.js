export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  ASSOCIATE: "ASSOCIATE",
};

export const PERMISSION_MODULES = [
  {
    key: "services",
    label: "Services Engine",
    actions: [
      { key: "services:view", label: "View Page" },
      { key: "services:create", label: "Add Service" },
      { key: "services:edit", label: "Edit Service" },
      { key: "services:archive", label: "Archive Service" },
      { key: "services:delete", label: "Delete Service" },
    ],
  },
  {
    key: "projects",
    label: "Projects Hub",
    actions: [
      { key: "projects:view", label: "View Page" },
      { key: "projects:create", label: "Add Project" },
      { key: "projects:edit", label: "Edit Project" },
      { key: "projects:archive", label: "Archive Project" },
      { key: "projects:delete", label: "Delete Project" },
    ],
  },
  {
    key: "careers",
    label: "Talent / Careers",
    actions: [
      { key: "careers:view", label: "View Openings" },
      { key: "careers:create", label: "Add Job Opening" },
      { key: "careers:edit", label: "Edit Job Opening" },
      { key: "careers:archive", label: "Archive Opening" },
      { key: "careers:delete", label: "Delete Opening" },
    ],
  },
  {
    key: "faqs",
    label: "Knowledge Base (FAQs)",
    actions: [
      { key: "faqs:view", label: "View Page" },
      { key: "faqs:create", label: "Add FAQ" },
      { key: "faqs:edit", label: "Edit FAQ" },
      { key: "faqs:delete", label: "Delete FAQ" },
    ],
  },
  {
    key: "submissions",
    label: "Forms > Contact Us",
    actions: [
      { key: "submissions:view", label: "View Page & Inquiries" },
      { key: "submissions:delete", label: "Delete Inquiries" },
    ],
  },
  {
    key: "users",
    label: "User & Role Management",
    actions: [
      { key: "users:manage", label: "Manage Users & Permissions (Super Admin)" },
    ],
  },
];

export function getCurrentUserSession() {
  if (typeof window === "undefined") return null;
  try {
    const sessionStr = localStorage.getItem("pmv_admin_session");
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    return session?.user || null;
  } catch (e) {
    return null;
  }
}

// Helper function to check if session user has a permission
export function hasPermission(userSession, permissionKey) {
  const user = userSession || getCurrentUserSession();
  if (!user) return false;
  if (user.role === SYSTEM_ROLES.SUPER_ADMIN) return true;
  const permissions = user.permissions || [];
  return permissions.includes(permissionKey);
}

// Helper function to check if session user can view a page module
export function canViewPage(userSession, moduleKey) {
  const user = userSession || getCurrentUserSession();
  if (!user) return false;
  if (user.role === SYSTEM_ROLES.SUPER_ADMIN) return true;
  if (moduleKey === "dashboard") return true; // Dashboard accessible to all logged-in users
  if (moduleKey === "contact") {
    return hasPermission(user, "submissions:view") || hasPermission(user, "contact:view");
  }
  return hasPermission(user, `${moduleKey}:view`);
}

// Server-side helper to extract performedBy username/name from request headers
export function getPerformedBy(request) {
  if (!request) return "Admin";
  try {
    const performedByHeader = request.headers.get("x-performed-by");
    if (performedByHeader) {
      return decodeURIComponent(performedByHeader);
    }
  } catch (e) {
    console.error("Error getting performedBy from request:", e);
  }
  return "Admin";
}
