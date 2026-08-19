import AccessRestricted from "@/components/home/AccessRestricted";
import { hasOrganizationAccessServer } from "@/lib/auth/employerClaims.server";

// Gates every /company route: users without an organization role on their
// rma_ids claim (e.g. individual/employee-only accounts, or logged-out
// visitors) see an access-restricted message instead of the dashboard.
export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await hasOrganizationAccessServer();

  if (!hasAccess) {
    return <AccessRestricted />;
  }

  return <>{children}</>;
}
