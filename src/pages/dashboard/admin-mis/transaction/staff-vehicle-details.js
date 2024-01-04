import { Helmet } from 'react-helmet-async';
// sections
import StaffVehicleDetailsView from 'src/sections/admin-mis/transaction/staff-vehicle-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Staff Vehicle Details </title>
      </Helmet>

      <StaffVehicleDetailsView />
    </>
  );
}
