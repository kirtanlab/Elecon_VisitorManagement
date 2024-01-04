import { Helmet } from 'react-helmet-async';
// sections
import VendorMasterView from 'src/sections/admin-mis/master/vendor-master/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Vendor Master </title>
      </Helmet>

      <VendorMasterView/>
    </>
  );
}
