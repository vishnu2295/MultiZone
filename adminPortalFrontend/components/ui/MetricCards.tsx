import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export interface MetricCard {
  value: string;
  description: string;
  icon?: React.ReactNode;
}

export interface MetricCardsProps {
  metrics: MetricCard[];
  layout?: "vertical" | "horizontal";
  cardSx?: any;
  reverseTextOrder?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  layout = "vertical",
  cardSx,
  reverseTextOrder,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        pt: 1,
        gap: 2,
      }}
    >
      {metrics.map((card, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: "308.75px",
            height: layout === "horizontal" ? "88px" : "124px",
            borderRadius: "11.5px",
            borderWidth: "0.63px",
            borderColor: "divider",
            opacity: 1,
            padding: layout === "horizontal" ? "14px" : "15px",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: layout === "horizontal" ? "row" : "column",
            alignItems: layout === "horizontal" ? "center" : "flex-start",
            justifyContent: layout === "horizontal" ? "flex-start" : "center",
            gap: layout === "horizontal" ? "16px" : "8px",
            boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
            border: "none",
            ...cardSx,
          }}
        >
          {card.icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: layout === "horizontal" ? "48px" : "28px",
                height: layout === "horizontal" ? "48px" : "28px",
                borderRadius: layout === "horizontal" ? "12px" : "5px",
                backgroundColor: "status.lightCyan",
                color: "primary.main",
                "& svg": {
                  fontSize: layout === "horizontal" ? "24px" : "18px",
                },
              }}
            >
              {card.icon}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: reverseTextOrder ? "column-reverse" : "column",
              gap: layout === "horizontal" ? "2px" : "4px",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: layout === "horizontal" ? "28px" : "18px",
                color: "metrics.valueText",
              }}
            >
              {card.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                fontSize: "12px",
                color: "metrics.descriptionText",
              }}
            >
              {card.description}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};
