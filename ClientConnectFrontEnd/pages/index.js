import React, { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import useToken from "hooks/useToken";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { LinearProgress, Grid, Typography } from "@mui/material";
import { useRouter } from 'next/router';
import FeatureCardGrid from '../components/Containers/FeatureCardGrid';
import { checkUserRole } from '../utils/auth-utils';

const Home = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const tokenData = useToken();
  const accessToken = tokenData?.accessToken;
  const decodedToken = tokenData?.decoded;

  const roles = user?.rmaAppRoles || decodedToken?.rmaAppRoles || [];
  const BrokerId = user?.rmaAppUserMetadata?.BrokerageIds?.[0];

  const { isAdministrator, isBrokerRep, hasAdminPortalRole, hasClientConnectRole,hasDualPortalAccess } = 
    checkUserRole(roles);

  useEffect(() => {
    if (!isLoading && user && !isAdministrator && !hasDualPortalAccess) {
      if (isBrokerRep) {
        // Sibling zone at the origin root, not a page of this app — hard
        // navigation, and never basePath-prefixed (router.push would send
        // a /broker build to /broker/brokerPortal/*, which doesn't exist).
        window.location.assign('/brokerPortal/dashboard');
      } else if (hasAdminPortalRole) {
        router.push('/Dashboard');
      } else if (hasClientConnectRole) {
        router.push('/Dashboard');
      }
    }
  }, [user, isLoading, isAdministrator, isBrokerRep, hasAdminPortalRole, hasClientConnectRole, router]);

  if (isLoading) return <LinearProgress />;

  if (isAdministrator) {
    const portalCards = [
      {
        title: "Client Connect",
        link: "/Dashboard",
        Icon: PeopleOutlineIcon,
      },
      {
        title: "Broker Portal",
        link: "/brokerPortal/dashboard",
        Icon: DomainAddIcon,
        external: true,
      },
      {
        title: "Admin Portal",
        link: "/adminPortal",
        Icon: ManageAccountsIcon,
      },
    ];
    return (
      <div>
        <Grid sx={{ my: 2 }}>
          <Typography variant="h6" align="left">
            Select Portal
          </Typography>
        </Grid>
        <FeatureCardGrid cards={portalCards} accessToken={accessToken} brokerId={BrokerId} />
      </div>
    );
  }
  if(hasDualPortalAccess){
    const dualPortalCards = [
      { title: "Client Connect", link: "/Dashboard", Icon: PeopleOutlineIcon },
      { title: "Broker Portal", link: "/brokerPortal/dashboard", Icon: DomainAddIcon, external: true },
    ];
    
      return (
        <div>
          <Typography variant="h6">Select Portal</Typography>
          <FeatureCardGrid cards={dualPortalCards} accessToken={accessToken} brokerId={BrokerId} />
        </div>
      );
  }
  return <LinearProgress />;
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const session = await getSession(req, res);

    if (!session?.user) {
      return {
        redirect: { destination: '/api/auth/login', permanent: false },
      };
    }

    const { isAdministrator, isBrokerRep, hasAdminPortalRole, hasClientConnectRole,hasDualPortalAccess } = 
      checkUserRole(session.user.rmaAppRoles || []);

    if (isAdministrator) return { props: {} };
    if(hasDualPortalAccess) return { props: {} };
    // basePath: false on the zone redirects — /brokerPortal and /adminPortal
    // are sibling zones at the origin root, so a /broker-prefixed build must
    // not prepend its basePath to them. No-op when BASE_PATH is unset.
    if (isBrokerRep) return { redirect: { destination: '/brokerPortal/dashboard', permanent: false, basePath: false } };
    if (hasClientConnectRole) return { redirect: { destination: '/Dashboard', permanent: false } };
    if(hasAdminPortalRole ) return {redirect:{destination:'/adminPortal/dashboard',permanent:false,basePath:false}}

    return { props: {} };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: {} };
  }
};

export default Home;
