import { Helmet } from 'react-helmet-async';
// sections
import WorkTypeMasterView from 'src/sections/admin-mis/master/work-type-master/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Work Type Master </title>
      </Helmet>

      <WorkTypeMasterView/>
    </>
  );
}
