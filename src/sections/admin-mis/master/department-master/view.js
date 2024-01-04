// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
// components
import { LinearProgress } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import { useAdminMISContext } from 'src/context/admin_mis_context';
// import DepartmentForm from './department-form';
import DepartmentRender from './department-render';

// ----------------------------------------------------------------------

export default function DepartmentMasterView() {
  const { user } = useAuthContext();
  const [currData, setCurrData] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);
  const settings = useSettingsContext();
  const { addDepartmentFlag, deleteMasterFlag} = useAdminMISContext();

  const getCurrData = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/department/getAll`;
      const res = await axios.get(URL);
      setCurrData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
    setApiCalled(true);
  };

  useEffect(() => {
    getCurrData();
  }, []);

  useEffect(() => {
    getCurrData();
  }, [addDepartmentFlag, deleteMasterFlag]);

  return (
    // apiCalled ?
    <DepartmentRender
      title="Department Master"
      tableData={currData}
      isApiCalled={apiCalled}
      tableLabels={[
        { id: 'company', label: 'Company', width: '30%' },
        { id: 'division', label: 'Division', width: '30%' },
        { id: 'department', label: 'Department', width: '30%' },
        { id: '' },
      ]}
    /> // : <LinearProgress/>
  );
}
