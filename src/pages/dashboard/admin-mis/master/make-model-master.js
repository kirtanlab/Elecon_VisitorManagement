import { Helmet } from 'react-helmet-async';
import MakeModelMasterView from 'src/sections/admin-mis/master/make-model-master/view';

          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Make & Model Master </title>
      </Helmet>

      <MakeModelMasterView/>
    </>
  );
}
