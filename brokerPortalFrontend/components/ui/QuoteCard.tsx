"use client";

import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ChevronDown } from "lucide-react";
import QuoteBadge from "./QuoteBadge";
import Link from "next/link";

export interface Quote {
  id: string;
  companyName: string;
  quoteType: "Quick Quote" | "Full Quote";
  daysRemaining: number;
  quoteId: string;
  quoteReference: string;
  monthlyPremium: string;
  coverageAmount: string;
  createdDate: string;
  status: string;
  numberOfEmployees?: number;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  contactMobile?: string;
}

interface QuoteCardProps {
  quote: Quote;
  onOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function QuoteCard({ quote, onOpenMenu }: QuoteCardProps) {
  const quotePath = quote.quoteType === "Quick Quote" ? "quick" : "preview";

  const quoteDetails = [
    {
      label: "Quote ID",
      value: quote.quoteId,
      href: `/quotes/${quote.id}/${quotePath}`,
      valueColor: "var(--primary)",
    },
    {
      label: "Monthly Premium",
      value: quote.monthlyPremium,
      valueColor: "var(--primary)",
    },
    {
      label: "Coverage Amount",
      value: quote.coverageAmount,
      valueColor: "var(--text-primary)",
    },
    {
      label: "Created Date",
      value: quote.createdDate,
      valueColor: "var(--text-primary)",
    },
    {
      label: "No of Employees",
      value: quote.numberOfEmployees ?? "-",
      valueColor: "var(--text-primary)",
    },
  ];

  return (
    <Card
      key={quote.id}
      sx={{
        boxSizing: "border-box",
        background: "var(--card-secondary)",
        border: "0.625px solid var(--border)",
        borderRadius: "10px",
        p: "25px",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Company Name & Badges */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "var(--text-primary)",
                m: 0,
              }}
            >
              {quote.companyName}
            </Typography>
            <QuoteBadge
              type={quote.quoteType}
              daysRemaining={quote.daysRemaining}
            />
          </Box>

          {/* Quote Details */}
          <Grid container spacing={2}>
            {quoteDetails.map(({ label, value, href, valueColor }) => (
              <Grid key={label} size={{ xs: 12, sm: "grow" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  {label}
                </Typography>

                <Typography
                  component={href ? Link : "p"}
                  href={href}
                  sx={{
                    fontSize: "14px",
                    color: valueColor,
                    fontWeight: 500,
                    ...(href && {
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": {
                        color: "var(--primary)",
                      },
                    }),
                  }}
                >
                  {value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Actions Button */}
        <Button
          variant="outlined"
          endIcon={<ChevronDown size={20} />}
          onClick={onOpenMenu}
          sx={{
            height: "36px",
            bgcolor: "var(--table-header-bg)",
            border: "1px solid var(--text-secondary)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            textTransform: "none",
            outline: "none",
            "&:focus": {
              outline: "none",
            },
            "&.Mui-focusVisible": {
              outline: "none",
              borderColor: "var(--text-primary)",
            },
            "&:hover": {
              bgcolor: "var(--border)",
              borderColor: "var(--text-primary)",
            },
          }}
        >
          Actions
        </Button>
      </Box>
    </Card>
  );
}
