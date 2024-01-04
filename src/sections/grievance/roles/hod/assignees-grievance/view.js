// @mui

import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
// roles
import HodRender from './hod-render';

// ----------------------------------------------------------------------

export default function GrievanceView() {

  const {user} = useAuthContext();

  const settings = useSettingsContext();

    return (
      <HodRender />
    );

}
