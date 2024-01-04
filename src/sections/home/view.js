// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Button } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import AdminTable from './roles/admin/admin-table';
import EmployeeRender from './roles/employee-render';
import HodRender from './roles/hod-render';


// ----------------------------------------------------------------------



export default function HomeView() {
  const settings = useSettingsContext();

  const {user} = useAuthContext();

  if(user?.role === 'admin')
    return (
      // <AdminHomePage/>
     <AdminTable/>
    );

    if(user?.role === 'employee')
      return (
        // <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        //   <Typography variant="h4"> This is  home </Typography>
        //   <Button variant='contained' color='warning'> employee </Button>
        // </Container>
        <EmployeeRender/>
      );

    if(user?.role === 'gateUser')
      return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> This is GATEUSER&apos;S home </Typography>
          <Button variant='outlined' color='success'> gate user </Button>
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
    if(user?.role === 'hod')
      return (
        <HodRender/>
      );
    
    // default
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography variant="h4"> This is default home </Typography>
        <Button color='error' variant='outlined'> default home page</Button>
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
