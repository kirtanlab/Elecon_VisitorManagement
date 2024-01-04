import { Helmet } from 'react-helmet-async';
// sections
import CommercialVehicleDetailsView from 'src/sections/admin-mis/transaction/commercial-vehicle-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Commercial Vehicle Details </title>
      </Helmet>

      <CommercialVehicleDetailsView />
    </>
  );
}
