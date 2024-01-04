import { Helmet } from 'react-helmet-async';
// sections
import BillingDetailsView from 'src/sections/admin-mis/transaction/billing-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Billing Details </title>
      </Helmet>

      <BillingDetailsView />
    </>
  );
}
