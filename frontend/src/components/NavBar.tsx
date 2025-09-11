import * as React from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, Avatar, Divider, Tooltip, Switch
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";

type Props = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

const NavBar: React.FC<Props> = ({ mode, toggleTheme }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const authed = Boolean(localStorage.getItem("token"));

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    showSnackbar("Logged out", "info");
    navigate("/login");
  };

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={3}>
        <Toolbar
          sx={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "space-between" }}
        >
          {/* Left: hamburger */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Center: logo + title */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                bgcolor: mode === "light" ? "secondary.main" : "secondary.light",
              }}
            >
              <TaskAltRoundedIcon fontSize="small" />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 700,
                letterSpacing: 0.3,
                borderBottom: "2px solid #00BCD4",
                pb: "2px",
              }}>
              Task Manager
            </Typography>
          </Box>

          {/* Right: theme toggle */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
              <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
                {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={"Logout"}>
                <LogoutRoundedIcon sx={{ml: 4}} onClick={handleLogout}/>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer menu (mobile-first nav) */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, pt: 1 }}>
          <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 1, bgcolor: "secondary.main" }}>
              <TaskAltRoundedIcon />
            </Avatar>
            <Typography 
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.3,
                borderBottom: "2px solid #00BCD4",
                pb: "2px",
              }}
            >
              Task Manager
            </Typography>
          </Box>

          <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <LightModeRoundedIcon fontSize="small" />
            <Switch
              checked={mode === "dark"}
              onChange={toggleTheme}
            />
            <DarkModeRoundedIcon fontSize="small" />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <List>
            <ListItemButton onClick={() => go("/tasks")}>
              <ListItemIcon><ListAltRoundedIcon /></ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItemButton>

            <ListItemButton onClick={() => go("/create")}>
              <ListItemIcon><AddCircleOutlineRoundedIcon /></ListItemIcon>
              <ListItemText primary="Create Task" />
            </ListItemButton>

            <Divider sx={{ my: 0.5 }} />

            {!authed ? (
              <>
                <ListItemButton onClick={() => go("/login")}>
                  <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton onClick={() => go("/register")}>
                  <ListItemIcon><LoginRoundedIcon /></ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
