import { Helmet } from 'react-helmet-async';
// sections
import HotelMasterView from 'src/sections/admin-mis/master/hotel-master/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Master - Hotel Master </title>
      </Helmet>

      <HotelMasterView/>
    </>
  );
}
