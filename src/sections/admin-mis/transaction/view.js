
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
import TransactionRender from './transaction-dashboard-render';

// ----------------------------------------------------------------------

export default function TransactionView() {
  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3} disableequaloverflow>

        <Grid xs={12}>
          <TransactionRender title="Transaction Master" subheader=" " list={_bookingNew}  />
        </Grid>

      </Grid>
     
        
{/*    
      <Typography variant="h4"> MIS - Transaction </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      /> */}
    </Container>
  );
}
