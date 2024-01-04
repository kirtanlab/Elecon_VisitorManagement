/* eslint-disable */
// @mui
import { Box, Button, Container, Typography, alpha } from "@mui/material";

// import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettingsContext } from 'src/components/settings';
import ProfileForm from "./profile-form";

// ----------------------------------------------------------------------

// import { useEffect } from "react";

// ----------------------------------------------------------------------

export default function VisitorView() {
  const settings = useSettingsContext();

//   const {user} = useAuthContext();


//   useEffect(() => {
//     console.log(user.role);
//   }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* <Typography variant="h4"> This is default profile management </Typography> */}
      <ProfileForm />
    
    </Container>
  );
}
