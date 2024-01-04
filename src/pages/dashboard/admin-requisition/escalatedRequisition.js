import { Helmet } from 'react-helmet-async';
// sections
import EscalatedRequisitionView from 'src/sections/admin-requisition/roles/admin/escalated/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Escalated Requisition</title>
      </Helmet>

      <EscalatedRequisitionView />
    </>
  );
}
