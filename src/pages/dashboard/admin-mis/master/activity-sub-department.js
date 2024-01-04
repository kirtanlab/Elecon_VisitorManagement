import { Helmet } from 'react-helmet-async';
// sections
import ActivitySubDepartmentView from 'src/sections/admin-mis/master/activity-sub-department/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Master- Activity Sub Department </title>
      </Helmet>

      <ActivitySubDepartmentView/>
    </>
  );
}
