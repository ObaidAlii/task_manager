// src/components/Footer.tsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.primary.main,
        color: theme.palette.secondary.contrastText || "#fff",
        py: 2,
        textAlign: "center",
        mt: "auto",
        borderTop: `3px solid ${theme.palette.info.light}`, // cyan accent top border
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.2)", // soft top shadow
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Organize your tasks efficiently.
      </Typography>
      <Typography
        variant="caption"
        sx={{ display: "block", mt: 0.5, opacity: 0.8 }}
      >
        © {new Date().getFullYear()} Obaid
      </Typography>
    </Box>
  );
};

export default Footer;
