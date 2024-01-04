/* eslint-disable */
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
import HotelBookingRender from './hotel-booking-render';

// ----------------------------------------------------------------------

export default function HotelBookingDetailsView() {
  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const [currData, setCurrData] = useState([]);
  const { addDepartmentFlag } = useAdminMISContext();


  const getCurrData = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/bill/hotel/${user._id}/getAll`;
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

    return (
      currData ?
        <HotelBookingRender
          title="Hotel Booking Details"
          tableData={currData}
          tableLabels={[
            { id: 'company', label: 'Company' },
            { id: 'division', label: 'Division' },
            { id: 'department', label: 'Department' },
            { id: 'hotel', label: 'Hotel Name' },
            { id: 'guest_name', label: 'Guest Name' },
            { id: 'booked_by', label: 'Booked By' },
            { id: "" },
          ]}
        /> : <div style={{ marginTop: 10 }}> <LinearProgress /> </div>
    );
}
