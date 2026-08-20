import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import QuoteBadge from "./QuoteBadge";
import CustomButton from "@/components/ui/button";
import Link from "next/link";

interface Quote {
  quoteId: string;
  quoteReference: string;
  quoteType: "Quick Quote" | "Full Quote";
  status: string;
  monthlyPremium: number;
  coverageAmount: number;
  createdAt: string;
}

interface QuoteCardProps {
  quote: Quote;
}

const fmt = (d: string) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};

export default function PreviousQuoteCard({ quote }: QuoteCardProps) {
  const quotePath = quote.quoteType === "Quick Quote" ? "quick" : "preview";

  const details = [
    {
      label: "Quote ID",
      value: quote.quoteReference,
      href: `/quotes/${quote.quoteId}/${quotePath}`,
      valueColor: "var(--primary)",
    },
    {
      label: "Monthly Premium",
      value: `R ${quote.monthlyPremium.toLocaleString()}`,
      valueColor: "var(--primary)",
    },
    {
      label: "Coverage Amount",
      value: `R ${quote.coverageAmount.toLocaleString()}`,
      valueColor: "var(--text-primary)",
    },
    {
      label: "Created Date",
      value: fmt(quote.createdAt),
      valueColor: "var(--text-primary)",
    },
  ];

  return (
    <Card
      key={quote.quoteId}
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
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              mb: "16px",
            }}
          >
            <QuoteBadge type={quote.quoteType} status={quote.status} />
          </Box>

          <Grid container spacing={2}>
            {details.map((detail) => (
              <Grid key={detail.label} size={{ xs: 12, sm: 3 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  {detail.label}
                </Typography>

                <Typography
                  component={detail.href ? Link : "p"}
                  href={detail.href}
                  sx={{
                    fontSize: "14px",
                    color: detail.valueColor,
                    fontWeight: 500,
                    ...(detail.href && {
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": {
                        color: "var(--primary)",
                      },
                    }),
                  }}
                >
                  {detail.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <CustomButton variant="outlined" size="sm">
            Download Quote
          </CustomButton>
        </Box>
      </Box>
    </Card>
  );
}
