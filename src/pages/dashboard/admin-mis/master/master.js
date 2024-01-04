import { Helmet } from 'react-helmet-async';
// sections
import MasterView from 'src/sections/admin-mis/master/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> MIS - Master </title>
      </Helmet>

      <MasterView />
    </>
  );
}
