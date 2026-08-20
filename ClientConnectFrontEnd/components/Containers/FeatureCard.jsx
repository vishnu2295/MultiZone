import { useTheme } from "@emotion/react";
import { Card, CardActionArea, Typography } from "@mui/material";
 
import React from "react";
 
import PropTypes from "prop-types";
import { useRouter } from "next/router";
 
const FeatureCard = ({ title, link, Icon, disabled, accessToken, brokerId }) => {
  const router = useRouter();
  return (
    <>
      <Card sx={{ borderRadius: 0 }}>
        <CardActionArea
          disabled={disabled}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            py: 6,
            minWidth: 250,
          }}
          onClick={() => {
            if (accessToken !== undefined || brokerId !== undefined) {
              // Set cookies so Broker Portal can read auth on the same domain
              document.cookie = `bp_token=${accessToken}; path=/; SameSite=Lax`;
              document.cookie = `bp_broker_id=${brokerId || ""}; path=/; SameSite=Lax`;
            }
            // /brokerPortal and /adminPortal are sibling zones at the origin
            // root, not pages of this app — they need a hard navigation with
            // no basePath prefix (router.push in a /broker build would send
            // them to /broker/brokerPortal/*, which doesn't exist).
            const isZoneLink =
              link.startsWith("/brokerPortal") || link.startsWith("/adminPortal");
            if (isZoneLink) {
              window.location.assign(link);
            } else {
              router.push(link);
            }
          }}>
          <Icon
            sx={{ fontSize: 45, mb: 1, color: disabled && "text.secondary" }}
          />
          <Typography color="textPrimary">{title}</Typography>
        </CardActionArea>
      </Card>
    </>
  );
};
 
export default FeatureCard;
 
FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
};