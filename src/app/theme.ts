import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f4f5f7",
      paper: "#ffffff"
    },
    primary: {
      main: "#f2b705",
      contrastText: "#1b1b1b"
    },
    text: {
      primary: "#1f2328",
      secondary: "#4b5563"
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: '"Source Sans 3", system-ui, sans-serif',
    h5: {
      fontWeight: 700
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          borderRadius: 18
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999
        }
      }
    }
  }
});
