import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";
import { DataSources } from "./components/data-sources";
import { ApiManagement } from "./components/api-management";
import { QueryEditor } from "./components/query-editor";
import { ApiUsers } from "./components/api-users";
import { ApiCallLogs } from "./components/api-call-logs";
import { NotFound } from "./components/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "data-sources", Component: DataSources },
      { path: "apis", Component: ApiManagement },
      { path: "api-users", Component: ApiUsers },
      { path: "api-logs", Component: ApiCallLogs },
      { path: "query", Component: QueryEditor },
      { path: "*", Component: NotFound },
    ],
  },
]);
