// @mui
import { alpha } from '@mui/material/styles';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
// roles
import HodRender from './roles/hod/assignees-requisition/hod-render';
import AdminRender from './roles/admin-render';
import EmployeeRender from './roles/employee-render';


// ----------------------------------------------------------------------

export default function RequisitionView() {

  const {user} = useAuthContext();

  const settings = useSettingsContext();

  if (user?.role === 'admin')
    return (
      <AdminRender/>
    );

  if (user?.role === 'employee')
    return (
      <EmployeeRender />
    );

  // if (user?.role === 'gateUser')
  //   return (
  //     <GateuserRender />
  //   );

  // if (user?.role === 'hod')
  //   return (
  //     <HodRender />
  //   );

  // default
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> This is requisition default </Typography>
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
