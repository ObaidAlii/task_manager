import * as React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import Footer from "./Footer";

type Props = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

const Layout: React.FC<Props> = ({ mode, toggleTheme }) => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar mode={mode} toggleTheme={toggleTheme} />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
