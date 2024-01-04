/* eslint-disable */
// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  AUTH_DEMO: '/auth-demo',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/home`,
    two: `${ROOTS.DASHBOARD}/visitor-management`,

    grievance: `${ROOTS.DASHBOARD}/grievance`,
    escalatedGrievance: `${ROOTS.DASHBOARD}/grievance/escalated-grievance`,
    grievanceHod: {
      root: `${ROOTS.DASHBOARD}/grievanceHod`,
      myGrievance: `${ROOTS.DASHBOARD}/grievanceHod/my-grievance`,
      assigneesGrievance: `${ROOTS.DASHBOARD}/grievanceHod/assignees-grievance`,
    },
    adminMis: {
      root: `${ROOTS.DASHBOARD}/adminMis`,
      // master: `${ROOTS.DASHBOARD}/adminMis/master`,
      master: {
        root: `${ROOTS.DASHBOARD}/adminMis/master`,
        departmentMaster: `${ROOTS.DASHBOARD}/adminMis/master/department-master`,
        activitySubDepartment: `${ROOTS.DASHBOARD}/adminMis/master/activity-sub-department`,
        vendorMaster: `${ROOTS.DASHBOARD}/adminMis/master/vendor-master`,
        hotelMaster: `${ROOTS.DASHBOARD}/adminMis/master/hotel-master`,
        itemMaster: `${ROOTS.DASHBOARD}/adminMis/master/item-master`,
        driverMaster: `${ROOTS.DASHBOARD}/adminMis/master/driver-master`,
        makeModelMaster: `${ROOTS.DASHBOARD}/adminMis/master/make-model-master`,
        vehicleTypeMaster: `${ROOTS.DASHBOARD}/adminMis/master/vehicle-type-master`,
        locationMaster: `${ROOTS.DASHBOARD}/adminMis/master/location-master`,
        workTypeMaster: `${ROOTS.DASHBOARD}/adminMis/master/work-type-master`,
      },
      transaction: {
        root: `${ROOTS.DASHBOARD}/adminMis/transaction`,
        billingDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/billing-details`,
        hotelBookingDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/hotel-booking-details`,
        simCardAllocationDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/sim-card-allocation-details`,
        assetDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/asset-details`,
        staffVehicleDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/staff-vehicle-details`,
        commercialVehicleDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/commercial-vehicle-details`,
        manPowerDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/man-power-details`,
        forexAllocationDetails: `${ROOTS.DASHBOARD}/adminMis/transaction/forex-allocation-details`,
      },
      reports: `${ROOTS.DASHBOARD}/adminMis/reports`,
    },
    mis: {
      root: `${ROOTS.DASHBOARD}/mis`,
      hotelBookingDetails: `${ROOTS.DASHBOARD}/mis/hotel-booking-details`,
      staffVehicleDetails: `${ROOTS.DASHBOARD}/mis/staff-vehicle-details`,
      commercialVehicleDetails: `${ROOTS.DASHBOARD}/mis/commercial-vehicle-details`,
    },
    
    adminRequisition: `${ROOTS.DASHBOARD}/admin-requisition`,
    escalatedRequisition: `${ROOTS.DASHBOARD}/admin-requisition/escalated-requisition`,
    requisitionHod: {
      root: `${ROOTS.DASHBOARD}/requisitionHod`,
      myRequisition: `${ROOTS.DASHBOARD}/requisitionHod/my-requisition`,
      assigneesRequisition: `${ROOTS.DASHBOARD}/requisitionHod/assignees-requisition`,
    },

    profile: `${ROOTS.DASHBOARD}/profile`,
  },
  // AUTHDEMO
  authDemo: {
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
};
//path.js