import { Helmet } from 'react-helmet-async';
// sections
import StaffVehicleView from 'src/sections/mis-emp/staff-vehicle-details/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Employee - MIS Staff Vehicle Details </title>
      </Helmet>

      <StaffVehicleView />
    </>
  );
}
