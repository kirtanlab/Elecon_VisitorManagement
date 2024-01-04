import { Helmet } from 'react-helmet-async';
// sections
import EscalatedGrievanceView from 'src/sections/grievance/roles/admin/escalated/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Escalated Grievance</title>
      </Helmet>

      <EscalatedGrievanceView />
    </>
  );
}
