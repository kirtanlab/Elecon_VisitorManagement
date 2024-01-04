import { Helmet } from 'react-helmet-async';
// sections
import AssetDetailsView from 'src/sections/admin-mis/transaction/asset-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Asset Details </title>
      </Helmet>

      <AssetDetailsView />
    </>
  );
}
