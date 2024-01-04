import { Helmet } from 'react-helmet-async';
// sections
import DepartmentMasterView from 'src/sections/admin-mis/master/department-master/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Department Master </title>
      </Helmet>

      <DepartmentMasterView/>
    </>
  );
}
