import { Helmet } from 'react-helmet-async';
// sections
import RequisitionView from 'src/sections/admin-requisition/roles/hod/dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> My Grievance</title>
      </Helmet>

      <RequisitionView />
    </>
  );
}
