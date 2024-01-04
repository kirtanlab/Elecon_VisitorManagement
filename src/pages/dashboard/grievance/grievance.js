import { Helmet } from 'react-helmet-async';
// sections
import GrievanceView from 'src/sections/grievance/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Grievance</title>
      </Helmet>

      <GrievanceView />
    </>
  );
}
