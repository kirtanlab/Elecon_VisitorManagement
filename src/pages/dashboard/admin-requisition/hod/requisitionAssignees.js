import { Helmet } from 'react-helmet-async';
// sections
import RequisitionView from 'src/sections/admin-requisition/roles/hod/assignees-requisition/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Assignees requisition</title>
      </Helmet>

      <RequisitionView />
    </>
  );
}
