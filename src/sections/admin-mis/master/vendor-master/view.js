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
import VendorForm from './vendor-form';
import VendorRender from './vendor-render';

// ----------------------------------------------------------------------

export default function VendorrMasterView() {
  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const [currData, setCurrData] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);

  const { addDepartmentFlag, editMasterFlag, deleteMasterFlag, } = useAdminMISContext();


  const getCurrData = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/vendor/getAll`;
      const res = await axios.get(URL);
      setCurrData(res?.data?.data);
      setApiCalled(true);
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
  }, [addDepartmentFlag,editMasterFlag, deleteMasterFlag])

  // if (user?.role === 'admin')
    return (
        <VendorRender
          title="Vendor Master"
          tableData={currData}
          isApiCalled = {apiCalled}
          tableLabels={[
            { id: 'name', label: 'Vendor Name', width:170 },
            { id: 'email_id', label: 'Email', width:170 },
            { id: 'phone_no', label: 'Phone', width:165 },
            { id: 'company', label: 'Company', width:130 },
            { id: 'division', label: 'Division', width:135 },
            { id: 'department', label: 'Department', width:135 },
            { id: "" , width: 15},
          ]}
        />
    );
}
