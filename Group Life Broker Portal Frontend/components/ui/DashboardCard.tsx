import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import { SvgIconComponent } from "@mui/icons-material";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: SvgIconComponent | React.ElementType;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  iconWrapperClassName?: string;
  iconWrapperStyle?: React.CSSProperties;
  titleClassName?: string;
  descriptionClassName?: string;
  disabled?: boolean;
}

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  onClick,
  style,
  iconWrapperStyle,
  disabled,
}: DashboardCardProps) {
  const cardContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        p: "24px",
      }}
    >
      <Box
        sx={{
          mb: "32px",
          color: "var(--dashboard-card-icon-wrapper-color)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          transition: "transform 0.2s ease-in-out",
          ".MuiCardActionArea-root:hover &": {
            transform: "scale(1.1)",
          },
          ...iconWrapperStyle,
        }}
      >
        <Icon sx={{ fontSize: "20px" }} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "24px",
            color: "var(--card-title-color, var(--text-primary))",
            marginBottom: "8px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "var(--quick-action-desc-color)",
            lineHeight: "20px",
            paddingRight: "24px",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        background: "var(--dashboard-card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        height: "100%",
        width: "100%",
        boxShadow: "none",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "var(--dashboard-card-hover-border)",
          bgcolor: "var(--dashboard-card-hover-bg)",
        },
        ...style,
      }}
    >
      {onClick ? (
        <CardActionArea
          onClick={onClick}
          disabled={disabled}
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </Card>
  );
}
