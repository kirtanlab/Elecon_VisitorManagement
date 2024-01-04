import { Helmet } from 'react-helmet-async';
// sections
import RequisitionView from 'src/sections/admin-requisition/roles/hod/my-requisition/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> My Requisition</title>
      </Helmet>

      <RequisitionView />
    </>
  );
}
