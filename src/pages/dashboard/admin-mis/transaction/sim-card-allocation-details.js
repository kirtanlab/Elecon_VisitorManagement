import { Helmet } from 'react-helmet-async';
// sections
import SimCardAllocationDetailsView from 'src/sections/admin-mis/transaction/sim-card-allocation-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Sim Card Allocation Details </title>
      </Helmet>

      <SimCardAllocationDetailsView />
    </>
  );
}
