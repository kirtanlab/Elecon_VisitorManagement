import { Helmet } from 'react-helmet-async';
// sections
import DriverMasterView from 'src/sections/admin-mis/master/driver-master/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Master - Driver Master </title>
      </Helmet>

      <DriverMasterView/>
    </>
  );
}
