import { Helmet } from 'react-helmet-async';
// sections
import ItemMasterView from 'src/sections/admin-mis/master/item-master/view';
          
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Master - Item Master </title>
      </Helmet>

      <ItemMasterView/>
    </>
  );
}
