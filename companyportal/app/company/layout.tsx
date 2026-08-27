import AccessRestricted from "@/components/home/AccessRestricted";
import HomeNavbar from "@/components/home/HomeNavbar";
import { hasOrganizationAccessServer } from "@/lib/auth/employerClaims.server";
import { CompanyProfileProvider } from "@/lib/context/CompanyProfileContext";

// Gates every /company route: users without an organization role on their
// rma_ids claim (e.g. individual/employee-only accounts, or logged-out
// visitors) see an access-restricted message instead of the dashboard.
export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await hasOrganizationAccessServer();

  return (
    <CompanyProfileProvider>
      <HomeNavbar />
      {hasAccess ? children : <AccessRestricted />}
    </CompanyProfileProvider>
  );
}
