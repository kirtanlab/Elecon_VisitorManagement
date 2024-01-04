import { Helmet } from 'react-helmet-async';
// sections
import MisDashboardView from 'src/sections/admin-mis/misDashboard/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>MIS - Dshboard</title>
      </Helmet>

      <MisDashboardView/>
    </>
  );
}
