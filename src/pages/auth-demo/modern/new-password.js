import { Helmet } from 'react-helmet-async';
import { ModernNewPasswordView } from 'src/sections/auth-demo/modern';
// sections


// ----------------------------------------------------------------------

export default function ModernNewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: New Password</title>
      </Helmet>
      <ModernNewPasswordView/>
      
    </>
  );
}
