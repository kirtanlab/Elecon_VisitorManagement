
import { _bankingContacts, _bookingNew } from 'src/_mock';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
// components
import { useAuthContext } from "src/auth/hooks";
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function MisDashboardView() {
  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
   
      <Typography variant="h4"> MIS - dashboard at emp side </Typography>

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
