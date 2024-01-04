import { Helmet } from 'react-helmet-async';
import { ModernVerifyView } from 'src/sections/auth-demo/modern';
// sections


// ----------------------------------------------------------------------

export default function ModernVerifyPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Verify</title>
      </Helmet>

      <ModernVerifyView/>
    </>
  );
}
