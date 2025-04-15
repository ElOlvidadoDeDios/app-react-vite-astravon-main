import AppLayout from "../layouts/AppLayout";
import { Navigate } from "react-router-dom";
import { HomePage } from "../pages/Home";
import { Podcast } from "../modules/podcast/Podcast";
import { Home } from "../modules/school/Home";
import { Activities } from "../modules/Activities/Activities";
import { AdminPanel } from "../modules/school/AdminPanel";
import { PodcastAdminPanel } from "../modules/podcast/PodcastAdminPanel";
import PodcastDetail from "../modules/podcast/PodcastDetails";
import SchoolDetail from "../modules/school/SchoolDetail";
import CourseDetail from "../modules/school/CourseDetail";
import ProtectedRoute from "../components/ProtectedRoute ";

const appRouter = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/podcast/", element: <Podcast /> },
      { path: "/podcast/:category", element: <PodcastDetail /> },
      { path: "/schools/", element: <Home /> },
      { path: "/school/cursos/:id", element: <SchoolDetail /> },
      { path: "/course/:id", element: <CourseDetail /> },
      { path: "/activities/", element: <Activities /> },
      { 
        path: "/AdminPanel/",
        element: (
          <ProtectedRoute adminOnly>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      { 
        path: "/PodcastAdminPanel/",
        element: (
          <ProtectedRoute adminOnly>
            <PodcastAdminPanel />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
];

export default appRouter;