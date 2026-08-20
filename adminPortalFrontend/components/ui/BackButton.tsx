"use client";

import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import { CustomButton } from "./CustomButton";
import Box from "@mui/material/Box";

interface BackButtonProps {
  onClickHandler?: () => void;
}

export default function BackButton({ onClickHandler }: BackButtonProps) {
  return (
    <>
      <Box sx={{ py: 1, px: 1 }}>
        <CustomButton
          variantType="secondary"
          sizeType="md"
          onClick={onClickHandler}
          startIcon={<ChevronLeftOutlinedIcon />}
        >
          Back
        </CustomButton>
      </Box>
    </>
  );
}
