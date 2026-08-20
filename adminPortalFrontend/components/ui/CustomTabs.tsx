import React from "react";
import { Tabs, Tab, Box, SxProps, Theme } from "@mui/material";

export interface TabItem {
  label: string;
  value: string;
}

export interface CustomTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  containerSx?: SxProps<Theme>;
}

export const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  containerSx,
}) => {
  return (
    <Box sx={{ ...containerSx }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onChange(newValue)}
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons={false}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            sx={{
              textTransform: "none",
              fontWeight: 400,
              fontSize: 14,
              color: "tabs.background",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
