import { Helmet } from 'react-helmet-async';
// sections
import TransactionView from 'src/sections/admin-mis/transaction/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> MIS - Transaction</title>
      </Helmet>

      <TransactionView />
    </>
  );
}
