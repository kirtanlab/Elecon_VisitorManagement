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
import HodRender from './hod-render';

// ----------------------------------------------------------------------

export default function RequisitionView() {

  const {user} = useAuthContext();

  const settings = useSettingsContext();

    return (
      <HodRender />
    );

}
