import { Helmet } from 'react-helmet-async';
// sections
import GrievanceView from 'src/sections/grievance/roles/hod/my-grievance/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> My Grievance</title>
      </Helmet>

      <GrievanceView />
    </>
  );
}
