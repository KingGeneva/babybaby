
import { RouteObject } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { forumRoutes } from "./forumRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { learningRoutes } from "./learningRoutes";
import { adminRoutes } from "./adminRoutes";

// Combine all routes
export const appRoutes: RouteObject[] = [
  ...publicRoutes,
  ...forumRoutes,
  ...dashboardRoutes,
  ...learningRoutes,
  ...adminRoutes
];
