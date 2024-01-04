import { Helmet } from 'react-helmet-async';
// sections
import HotelBookingView from 'src/sections/mis-emp/hotel-booking-details/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Employee - MIS Hotel Booking Details </title>
      </Helmet>

      <HotelBookingView />
    </>
  );
}
