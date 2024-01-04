import { Helmet } from 'react-helmet-async';
// sections
import ManPowerDetailsView from 'src/sections/admin-mis/transaction/man-power-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Man Power Details </title>
      </Helmet>

      <ManPowerDetailsView/>
    </>
  );
}
