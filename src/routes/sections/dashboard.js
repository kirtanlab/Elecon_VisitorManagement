import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/home'));
const PageVisitor = lazy(() => import('src/pages/dashboard/visitor-management'));
const PageGrievance = lazy(() => import('src/pages/dashboard/grievance'));
const PageFour = lazy(() => import('src/pages/dashboard/admin-mis/misDashboard'));
const PageFive = lazy(() => import('src/pages/dashboard/admin-mis/master/master'));
const PageSix = lazy(() => import('src/pages/dashboard/admin-mis/transaction/transaction'));

// ----------------------------------------------------------------------

// const { user } = useAuthContext()
// console.log("oooooooooooo ",JSON.parse(sessionStorage?.getItem('user'))?.role);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),

    // *********************************************************
    // i am not using this file
    // i have written this in index.js, so that i can use useAuthContext

    children:sessionStorage.getItem('role')==='hod'?[
      { element: <PageGrievance />, index: true },
      { path: 'visitor-management', element: <PageVisitor /> },
    ]: [
      { element: <IndexPage />, index: true },
      { path: 'visitor-management', element: <PageVisitor /> },
      { path: 'grievance', element: <PageGrievance /> },
      {
        path: 'adminMis', 
        children: [
          { element: <PageFour />, index: true },
          { path: 'master', element: <PageFive /> },
          { path: 'transaction', element: <PageSix /> },
        ],
      },
    ]
  },
];
