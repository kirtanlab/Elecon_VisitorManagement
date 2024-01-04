// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useAuthContext } from 'src/auth/hooks';
import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import axios from 'axios';
import { useSettingsContext } from 'src/components/settings';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import ManPowerDetailsRender from './man-power-render';

// ----------------------------------------------------------------------

export default function ManPowerDetailsView() {
  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const [currData, setCurrData] = useState([]);
  const { addDepartmentFlag } = useAdminMISContext();


  const getCurrData = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/bill/manPower/getAll`;
      const res = await axios.get(URL);
      setCurrData(res?.data?.data)
    }
    catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    getCurrData();
  }, [])

  useEffect(() => {
    getCurrData();
  }, [addDepartmentFlag])

  if (user?.role === 'admin')
    return (
      currData ?
        <ManPowerDetailsRender
          title="Man Power Details"
          tableData={currData}
          tableLabels={[
            { id: 'company', label: 'Company' },
            { id: 'division', label: 'Division' },
            { id: 'department', label: 'Department' },
            { id: 'contractor', label: 'Contracter Name' },
            { id: 'work_type', label: 'Work Type' },
            { id: 'location', label: 'Location' },
            { id: 'no_of_employee', label: 'No of Employees' },
            { id: "" },
          ]}
        /> : <div style={{ marginTop: 10 }}><LinearProgress /></div>
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Transaction - Man Power Details </Typography>

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