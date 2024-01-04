import { Helmet } from 'react-helmet-async';
// sections
import RequisitionView from 'src/sections/admin-requisition/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Admin Requisition</title>
      </Helmet>

      <RequisitionView />
    </>
  );
}
