import { Helmet } from 'react-helmet-async';
// sections
import CommercialVehicleView from 'src/sections/mis-emp/commercial-vehicle-details/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Employee - MIS Commercial Vehicle Details </title>
      </Helmet>

      <CommercialVehicleView />
    </>
  );
}
