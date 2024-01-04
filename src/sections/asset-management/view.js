/* eslint-disable */
// @mui
import { Box, Button, Container, Typography, alpha } from "@mui/material";

// import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------
// import { useEffect } from "react";

// import { useAuthContext } from "src/auth/hooks";
// import EmployeeRender from './roles/empolyee-render';

// import AdminRender from "./roles/admin-render";


// import GateuserRender from "./roles/gateuser-render";

// ----------------------------------------------------------------------

export default function VisitorView() {
  const settings = useSettingsContext();

//   const {user} = useAuthContext();


//   useEffect(() => {
//     console.log(user.role);
//   }, [])

//   if (user?.role === 'admin')
//     return (
//       <AdminRender/>
//     );

//   if (user?.role === 'employee' || user?.role === 'hod')
//     return (
//       <EmployeeRender />
//     );

//   if (user?.role === 'gateUser')
//     return (
//      <GateuserRender/>
//     );

  // default
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> This is default Asset management </Typography>
      <Button color="error" variant="outlined">
        admin page
      </Button>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      />
    </Container>
  );
}
