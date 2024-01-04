import { Helmet } from 'react-helmet-async';
// sections
import ForexAllocationDetailsView from 'src/sections/admin-mis/transaction/forex-allocation-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Forex Allocation Details </title>
      </Helmet>

      <ForexAllocationDetailsView />
    </>
  );
}
