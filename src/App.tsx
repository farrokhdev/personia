import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles, { LightTheme, DarkTheme } from "./config/global-styles";
import Routes from "./routes";
import { AlertColor } from "@mui/material";
import { GlobalContext, CeramicWrapper } from "./contexts";
import { CSnackbar } from "./components/mui/Snackbar";

function App() {
  const [theme, setTheme] = useState("light");

  const [alert, setAlert] = useState<{
    type: AlertColor | undefined;
    message: string;
  }>({ message: "", type: "success" });

  function makeAlert(type: AlertColor, message: string): void {
    setAlert({ type, message });
  }

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(
    false
  );
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  return (
    <ThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
      <>
        <GlobalStyles />

        <GlobalContext.Provider
          value={{
            theme,
            setTheme,
            makeAlert,
            notificationDrawerOpen,
            setNotificationDrawerOpen,
            chatOpen,
            setChatOpen,
          }}
        >
          <CeramicWrapper>
            <Routes />
          </CeramicWrapper>

          <CSnackbar
            open={alert.message !== ""}
            handleClose={() => {
              makeAlert("success", "");
            }}
            severity={alert.type}
            label={alert.message}
          />
        </GlobalContext.Provider>
      </>
    </ThemeProvider>
  );
}

export default App;
