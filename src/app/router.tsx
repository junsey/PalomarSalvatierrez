import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { PigeonsListPage } from "../pages/PigeonsListPage";
import { PigeonDetailPage } from "../pages/PigeonDetailPage";
import { PigeonsAgendaPage } from "../pages/PigeonsAgendaPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/palomas" replace />
  },
  {
    path: "/palomas",
    element: <AppShell />,
    children: [
      { index: true, element: <PigeonsListPage /> },
      { path: "calendario", element: <PigeonsAgendaPage /> },
      { path: ":numero", element: <PigeonDetailPage /> }
    ]
  }
]);
