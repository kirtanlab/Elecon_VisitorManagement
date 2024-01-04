// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
// components
import { useSettingsContext } from 'src/components/settings';
import { _bookingNew } from 'src/_mock';
import MasterRender from './master-render';

// ----------------------------------------------------------------------

export default function MasterView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
       <Grid container spacing={3} disableequaloverflow>

<Grid xs={12}>
  <MasterRender title="Admin MIS Master" subheader=" " list={_bookingNew}  />
</Grid>

</Grid>
      {/* <Typography variant="h4"> MIS - Master </Typography>

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
