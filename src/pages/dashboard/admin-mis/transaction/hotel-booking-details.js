import { Helmet } from 'react-helmet-async';
// sections
import HotelBookingDetailsView from 'src/sections/admin-mis/transaction/hotel-booking-details/view';
          
// ----------------------------------------------------------------------

export default function Page() { 
  return (
    <>
      <Helmet>
        <title> Transaction - Hotel Booking Details </title>
      </Helmet>

      <HotelBookingDetailsView />
    </>
  );
}
