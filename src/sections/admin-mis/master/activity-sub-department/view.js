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
import SubDepartmentForm from './sub-department-form';
import SubDepartmentRender from './sub-department-render';

// ----------------------------------------------------------------------

export default function ActivitySubDepartmentView() {
 
  const {user} = useAuthContext();

  const settings = useSettingsContext();

  const [currData, setCurrData] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);
  const { addDepartmentFlag, editMasterFlag, deleteMasterFlag, } = useAdminMISContext();


  const getCurrData = async() => {
    try{  
      const URL = `http://localhost:5000/api/v1/sub_department/getAll`;
      const res = await axios.get(URL);
      setCurrData(res?.data?.data)
    }
    catch(err){
      console.log(err);
    }
    setApiCalled(true);
  }


  useEffect(() => {
    getCurrData();
  }, [])

  useEffect(() => {
    getCurrData();
  }, [addDepartmentFlag, editMasterFlag, deleteMasterFlag])

  if (user?.role === 'admin')
    return (
  currData ? 
      <SubDepartmentRender 
        title="Sub Department Master"
        tableData={currData}
        isApiCalled={apiCalled}
        tableLabels={[
          { id: 'company', label: 'Company',},
          { id: 'division', label: 'Division',  },
          { id: 'department', label: 'Department', },
          { id: 'sub_department', label: 'Sub Department', },
          { id: 'gl_code', label: 'GL Code', },
          { id:""}, 
        ]} 
      /> : <div style={{marginTop: 10}}><LinearProgress/></div>
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Master- Activity Sub Department </Typography>

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
