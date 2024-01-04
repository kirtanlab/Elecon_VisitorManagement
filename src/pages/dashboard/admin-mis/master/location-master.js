import { Helmet } from 'react-helmet-async';
// sections
import LocationMasterView from 'src/sections/admin-mis/master/location-master/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Location Master </title>
      </Helmet>

      <LocationMasterView/>
    </>
  );
}
