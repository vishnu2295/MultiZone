import AccessRestricted from "@/components/common/AccessRestricted";
import { hasIndividualAccessServer } from "@/lib/auth/employeeClaims.server";
import { ProfileProvider } from "@/lib/profile/ProfileContext";

// Gates every /individual route: users without an individual role on their
// rma_ids claim (e.g. organization/employer-only accounts, or logged-out
// visitors) see an access-restricted message instead of the dashboard.
export default async function IndividualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await hasIndividualAccessServer();

  if (!hasAccess) {
    return <AccessRestricted />;
  }

  return <ProfileProvider>{children}</ProfileProvider>;
}
