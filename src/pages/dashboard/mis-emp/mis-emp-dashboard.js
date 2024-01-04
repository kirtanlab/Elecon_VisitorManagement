import { Helmet } from 'react-helmet-async';
// sections
import MisDashboardView from 'src/sections/mis-emp/mis-emp-dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Employee - MIS Dashboard </title>
      </Helmet>

      <MisDashboardView />
    </>
  );
}
