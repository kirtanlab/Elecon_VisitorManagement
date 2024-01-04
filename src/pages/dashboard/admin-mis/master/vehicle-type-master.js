import { Helmet } from 'react-helmet-async';
// sections
import VehicleTypeMasterView from 'src/sections/admin-mis/master/vehicle-type-master/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Vehicle Type Master </title>
      </Helmet>

      <VehicleTypeMasterView/>
    </>
  );
}
