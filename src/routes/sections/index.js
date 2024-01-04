/* eslint-disable */
import { lazy, Suspense } from 'react';
import { Navigate, useRoutes,Outlet } from 'react-router-dom';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { LoadingScreen } from 'src/components/loading-screen';
import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard } from 'src/auth/guard';

import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';

import { mainRoutes } from './main';

// import { dashboardRoutes } from './dashboard';
// ----------------------------------------------------------------------

export default function Router() {
  const IndexPage = lazy(() => import('src/pages/dashboard/home'));
  const PageVisitor = lazy(() => import('src/pages/dashboard/visitor-management'));
  
  const PageGrievance = lazy(() => import('src/pages/dashboard/grievance/grievance'));
  const PageGrievanceDashboard = lazy(() => import('src/pages/dashboard/grievance/hod/grievanceDashboard'));
  const PageMyGrievance = lazy(() => import('src/pages/dashboard/grievance/hod/myGrievance'));
  const PageGrievanceAssignee = lazy(() => import('src/pages/dashboard/grievance/hod/grievanceAssignees'));
  const PageGrievanceEscalated = lazy(() => import('src/pages/dashboard/grievance/escalatedGrievance'));

  const PageDashboard = lazy(() => import('src/pages/dashboard/admin-mis/misDashboard'));
  const PageMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/master'));
  const PageTransaction = lazy(() => import('src/pages/dashboard/admin-mis/transaction/transaction'));
  const PageReports = lazy(() => import('src/pages/dashboard/admin-mis/reports'));

  // masters routes
  const PageDepartmentMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/department-master'));
  const PageActivitySubDepartment = lazy(() => import('src/pages/dashboard/admin-mis/master/activity-sub-department'));
  const PageVendorMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/vendor-master'));
  const PageHotelMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/hotel-master'));
  const PageItemMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/item-master'));
  const PageDriverMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/driver-master'));
  const PageMakeModelMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/make-model-master'));
  const PageVehicleTypeMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/vehicle-type-master'));
  const PageLocationMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/location-master'));
  const PageWorkTypeMaster = lazy(() => import('src/pages/dashboard/admin-mis/master/work-type-master'));
  
  // transaction routes
  const PageBillingDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/billing-details'));
  const PageHotelBookingDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/hotel-booking-details'));
  const PageSimCardAllocationDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/sim-card-allocation-details'));
  const PageAssetDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/asset-details'));
  const PageStaffVehicleDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/staff-vehicle-details'));
  const PageCommercialVehicleDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/commercial-vehicle-details'));
  const PageManPowerDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/man-power-detail'));
  const PageForexAllocationDetails = lazy(() => import('src/pages/dashboard/admin-mis/transaction/forex-allocation-details'));

  // mis for employee
  const PageMisDashboard = lazy(() => import('src/pages/dashboard/mis-emp/mis-emp-dashboard'));
  const PageHotelBookingDetailsEmp = lazy(() => import('src/pages/dashboard/mis-emp/hotel-booking-details'));
  const PageStaffVehicleDetailsEmp = lazy(() => import('src/pages/dashboard/mis-emp/staff-vehicle-details'));
  const PageCommercialVehicleDetailsEmp = lazy(() => import('src/pages/dashboard/mis-emp/commercial-vehicle-details'));

  // Asset management
  const PageAsset = lazy(() => import('src/pages/dashboard/asset-management'));

  // Admin-Requisition routes
  const PageRequisition = lazy(() => import('src/pages/dashboard/admin-requisition/adminRequisition'));
  const PageRequisitionDashboard = lazy(() => import('src/pages/dashboard/admin-requisition/hod/requisitionDashboard'));
  const PageMyRequisition = lazy(() => import('src/pages/dashboard/admin-requisition/hod/myRequisition'));
  const PageRequisitionAssignee = lazy(() => import('src/pages/dashboard/admin-requisition/hod/requisitionAssignees'));
  const PageRequisitionEscalated = lazy(() => import('src/pages/dashboard/admin-requisition/escalatedRequisition'));

  // profile , settings
  const PageProfile = lazy(() => import('src/pages/dashboard/profile'));

  
  const { user } = useAuthContext();
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Auth routes
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes
    // ...dashboardRoutes,
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
      children: [
        { element: <IndexPage />, index: true },
        { path: 'visitor-management', element: <PageVisitor /> },

        user?.role === 'hod' ? {
          path: 'grievanceHod',
          children: [
            { element: <PageGrievanceDashboard />, index: true },
            { path: 'my-grievance' ,element: <PageMyGrievance /> },
            { path: 'assignees-grievance' ,element: <PageGrievanceAssignee /> },
          ]
        } : (
          user?.role === 'admin' ? {
            path: 'grievance',
            children: [
              { element: <PageGrievance /> , index: true },
              { path: '', element: <PageGrievance /> },
              { path: 'escalated-grievance', element: <PageGrievanceEscalated />},
            ]
          } : (user?.role === 'employee' ?{ path: 'grievance', element: <PageGrievance />} : { })
        ),
        
        user?.role==='admin' ? {
          path: 'adminMis', 
          children: [
            { element: <PageDashboard/>, index: true },
            { 
              path: 'master', 
              children: [
                { element: <PageMaster />, index: true }, 
                { path: 'department-master', element: <PageDepartmentMaster />},
                { path: 'activity-sub-department', element: <PageActivitySubDepartment />},
                { path: 'vendor-master', element: <PageVendorMaster />},
                { path: 'hotel-master', element: <PageHotelMaster />},
                { path: 'item-master', element: <PageItemMaster />},
                { path: 'driver-master', element: <PageDriverMaster />},
                { path: 'make-model-master', element: <PageMakeModelMaster />},
                { path: 'vehicle-type-master', element: <PageVehicleTypeMaster />},
                { path: 'location-master', element: <PageLocationMaster />},
                { path: 'work-type-master', element: <PageWorkTypeMaster />},
              ]
            },
            { 
              path: 'transaction', 
              children: [
                { element: <PageTransaction />, index: true },
                { path: 'billing-details', element: <PageBillingDetails />},
                { path: 'hotel-booking-details', element: <PageHotelBookingDetails />},
                { path: 'sim-card-allocation-details', element: <PageSimCardAllocationDetails />},
                { path: 'asset-details', element: <PageAssetDetails />},
                { path: 'staff-vehicle-details', element: <PageStaffVehicleDetails />},
                { path: 'commercial-vehicle-details', element: <PageCommercialVehicleDetails />},
                { path: 'man-power-details', element: <PageManPowerDetails />},
                { path: 'forex-allocation-details', element: <PageForexAllocationDetails />},
              ]
            },
            { path: 'reports', element: <PageReports /> },
          ],
        } : {},
        user?.role==='employee' || user?.role === 'hod'? {
          path: 'mis', 
          children: [
            { element: <PageMisDashboard />, index: true }, 
            { path: 'hotel-booking-details', element: <PageHotelBookingDetailsEmp />},
            { path: 'staff-vehicle-details', element: <PageStaffVehicleDetailsEmp />},
            { path: 'commercial-vehicle-details', element: <PageCommercialVehicleDetailsEmp />},
          ]
        }: {},

        user?.role === 'hod' ? {
          path: 'requisitionHod',
          children: [
            { element: <PageRequisitionDashboard />, index: true },
            { path: 'my-requisition' ,element: <PageMyRequisition /> },
            { path: 'assignees-requisition' ,element: <PageRequisitionAssignee /> },
          ]
        } : (
          user?.role === 'admin' ? {
            path: 'admin-requisition',
            children: [
              { element: <PageRequisition /> , index: true },
              { path: '', element: <PageRequisition /> },
              { path: 'escalated-requisition', element: <PageRequisitionEscalated />},
            ]
          } : (user?.role === 'employee' ?{ path: 'admin-requisition', element: <PageRequisition />} : { })
        ),
        // { path: 'admin-requisition', element: <PageAsset /> },
        { path: 'profile', element: <PageProfile /> }
      ]
    },

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
//routes/sec/index.js