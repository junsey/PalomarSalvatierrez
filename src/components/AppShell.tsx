import { NavLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export const AppShell = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Palomas", to: "/palomas" },
    { label: "Calendario", to: "/palomas/calendario" }
  ];

  return (
    <Box minHeight="100vh" bgcolor="background.default" display="flex" flexDirection="column">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ py: 1, gap: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Palomar Salvatierrez
          </Typography>
          {isMobile ? (
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" gap={1}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.to === "/palomas"}
                  color="inherit"
                  sx={(muiTheme) => ({
                    fontWeight: 600,
                    "&.active": {
                      color: muiTheme.palette.primary.main
                    }
                  })}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          flexGrow: 1
        }}
      >
        <Outlet />
      </Container>
      <Box component="footer" sx={{ borderTop: "1px solid #eee", py: 2 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} The Company Studio
          </Typography>
        </Container>
      </Box>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                sx={(muiTheme) => ({
                  "&.active .MuiListItemText-primary": {
                    color: muiTheme.palette.primary.main,
                    fontWeight: 700
                  }
                })}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
