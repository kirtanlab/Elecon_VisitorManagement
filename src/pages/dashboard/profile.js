import { Helmet } from 'react-helmet-async';
// sections
import ProfileView from 'src/sections/profile/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Profile</title>
      </Helmet>

      <ProfileView/>
    </>
  );
}
