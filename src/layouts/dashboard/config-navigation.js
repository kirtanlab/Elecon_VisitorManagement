/* eslint-disable */
import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext()
  console.log(user)
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview v5.3.0',
        items: user?.role !== 'gateUser' ?[
          { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Visitor Management', path: paths.dashboard.two, icon: ICONS.ecommerce },

          user?.role === 'employee' ? {
            title: 'Grievance',
            path: paths.dashboard.grievance,
            icon: ICONS.analytics,
          } : (
            user?.role === 'hod' ? {
              title: 'Grievance',
              path: paths.dashboard.grievanceHod.root,
              icon: ICONS.analytics,
              children: [
                {title: 'My Grievance', path: paths.dashboard.grievanceHod.myGrievance },
                {title: 'Assignee\'s Grievance', path: paths.dashboard.grievanceHod.assigneesGrievance },
              ]
            } : 
            {
              title: 'Grievance',
              path: paths.dashboard.grievance,
              icon: ICONS.analytics,
              children: [
                {title: 'Grievance', path: paths.dashboard.grievance },
                {title: 'Escalated Grievance', path: paths.dashboard.escalatedGrievance },
              ]
            }
          ),
        ] : [
          { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Visitor Management', path: paths.dashboard.two, icon: ICONS.ecommerce },
        ],
      },

      // FOR ADMIN ONLY some forms are at employee side
      // ----------------------------------------------------------------------
      {
        subheader: 'adminMis',
        items: user?.role === 'admin'?[
          {
            title: 'MIS',
            path: paths.dashboard.adminMis.root,
            icon: ICONS.file,
            children: [
              { title: 'Dashboard', path: paths.dashboard.adminMis.root },
              { 
                title: 'Master', 
                path: paths.dashboard.adminMis.master.root,
                children: [
                  { title: 'Department Master', path: paths.dashboard.adminMis.master.departmentMaster },
                  { title: 'Activity / Sub Department', path: paths.dashboard.adminMis.master.activitySubDepartment },
                  { title: 'Vendor Master', path: paths.dashboard.adminMis.master.vendorMaster },
                  { title: 'Hotel Master', path: paths.dashboard.adminMis.master.hotelMaster },
                  { title: 'Item Master', path: paths.dashboard.adminMis.master.itemMaster },
                  { title: 'Driver Master', path: paths.dashboard.adminMis.master.driverMaster },
                  { title: 'Make & Model Master', path: paths.dashboard.adminMis.master.makeModelMaster },
                  { title: 'Vehicle Type Master', path: paths.dashboard.adminMis.master.vehicleTypeMaster },
                  { title: 'Location Master', path: paths.dashboard.adminMis.master.locationMaster },
                  { title: 'Work Type Master', path: paths.dashboard.adminMis.master.workTypeMaster },
                ], 
              },
              { title: 'Transaction', 
                path: paths.dashboard.adminMis.transaction.root,
                children: [
                  { title: 'Billing Details', path: paths.dashboard.adminMis.transaction.billingDetails },
                  { title: 'Hotel Booking Details', path: paths.dashboard.adminMis.transaction.hotelBookingDetails },
                  { title: 'Sim Card Allocation Details', path: paths.dashboard.adminMis.transaction.simCardAllocationDetails },
                  { title: 'Asset Details', path: paths.dashboard.adminMis.transaction.assetDetails },
                  { title: 'Staff Vehicle Details', path: paths.dashboard.adminMis.transaction.staffVehicleDetails },
                  { title: 'Commercial Vehicle Details', path: paths.dashboard.adminMis.transaction.commercialVehicleDetails },
                  { title: 'Man Power Details', path: paths.dashboard.adminMis.transaction.manPowerDetails },
                  { title: 'Forex Allocation Details', path: paths.dashboard.adminMis.transaction.forexAllocationDetails },
                ],
              },
              { title: 'Reports', path: paths.dashboard.adminMis.reports },
            ],
          },
        ] : [],
      },

      // MIS for of Employee / hod side
      // ----------------------------------------------------------------------
      {
        subheader: 'adminMis',
        items: user?.role === 'employee' || user?.role === 'hod' ?[
          {
            title: 'MIS',
            path: paths.dashboard.mis.root,
            icon: ICONS.file,
            children: [
              { title: 'Hotel Booking Details', path: paths.dashboard.mis.hotelBookingDetails },
              { title: 'Staff Vehicle Details', path: paths.dashboard.mis.staffVehicleDetails },
              { title: 'Commercial Vehicle Details', path: paths.dashboard.mis.commercialVehicleDetails },
            ]
          }
        ]:[]
      },

      {
        subheader: 'Admin Requisition',
        items: user?.role !== 'gateUser' ?[
          // { title: 'Admin Requisition', path: paths.dashboard.adminRequisition, icon: ICONS.banking },
          user?.role === 'employee' ? {
            title: 'Admin Requisition',
            path: paths.dashboard.adminRequisition,
            icon: ICONS.banking,
          } : (
            user?.role === 'hod' ? {
              title: 'Admin Requisition',
              path: paths.dashboard.requisitionHod.root,
              icon: ICONS.banking,
              children: [
                {title: 'My Requisition', path: paths.dashboard.requisitionHod.myRequisition },
                {title: 'Assignee\'s Requisition', path: paths.dashboard.requisitionHod.assigneesRequisition },
              ]
            } : 
            {
              title: 'Admin Requisition',
              path: paths.dashboard.adminRequisition,
              icon: ICONS.banking,
              children: [
                {title: 'Admin Requisition', path: paths.dashboard.adminRequisition },
                {title: 'Escalated Requisition', path: paths.dashboard.escalatedRequisition },
              ]
            }
          ),
          
        ]:[]
      },

    ],

    []
  );

  return data;
}
// config-navigation