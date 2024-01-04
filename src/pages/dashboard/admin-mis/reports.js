import { Helmet } from 'react-helmet-async';
// sections
import ReportsView from 'src/sections/admin-mis/reports/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> MIS - Reports </title>
      </Helmet>

      <ReportsView />
    </>
  );
}
