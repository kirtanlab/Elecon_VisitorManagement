import { Helmet } from 'react-helmet-async';
// sections
import AssetView from 'src/sections/asset-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Asset Management</title>
      </Helmet>

      <AssetView/>
    </>
  );
}
