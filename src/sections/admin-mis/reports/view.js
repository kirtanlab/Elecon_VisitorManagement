/* eslint-disable */
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import {jsPDF} from "jspdf"
import axios from 'axios';

// ----------------------------------------------------------------------

export default function ReportsView() {
  const settings = useSettingsContext();

  const formatTimeAndDate = (d) => {
    var now = new Date(d)
    var date = now.toLocaleDateString();
    var time = now.toLocaleTimeString();
    return `${date}  ${time}`
}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

  const [selectedValue, setSelectedValue] = useState('');


  const handleHotelBillPrint = async() => {
    const doc = new jsPDF({orientation: "landscape", unit:'mm', format:[600, 600]})

    // const tempHeaders = ["Title", "Activity", "Problem Desc", "Employee Name", "Employee Email", "Requisition Date", "Status", "Escalated", "Resent", "Approval Remarks", "Closure Remarks"];
    const tempHeaders = ["Company", "Division", "Department", "Hotel", "Guest Name", "Booked By", "Purpose", "Requisition Date", "Total Days", "Stay From Date", "Stay To Date", "Billing Date", "Amount"];
    // const tempHeaders = ["Name", "Mobile", "Email", "Gender"];
    const headers = tempHeaders.map((header) => {
        return {
            id: header,
            name: header,
            prompt: header
        }
    })
    const URL = `http://localhost:5000/api/v1/bill/hotel/getAll`
    const res = await axios.get(URL);

    const tabled = res?.data?.data.map((el) => {
        // console.log("el el : ", el.approval_remarks)
        return {
            "Company": el.company,
            "Division": el.division,
            "Department": el.department,
            "Hotel": el.hotel,
            "Guest Name": el.guest_name,
            "Booked By": el.booked_by,
            "Purpose": el.purpose ? el.purpose : "---",
            "Requisition Date": formatTimeAndDate(el.requisition_date),
            "Total Days": el.total_days.toString(),
            "Stay From Date": formatTimeAndDate(el.stay_from_date),
            "Stay To Date": formatTimeAndDate(el.stay_to_date),
            "Billing Date": formatTimeAndDate(el.billing_date),
            "Amount": el.amount.toString(),
            
        }
    })


    console.log("tabled data : ")
    console.log(tabled)

    console.log("Header data : ")
    console.log(headers);

    doc.table(1, 1, tabled, headers, {autoSize: true});

    doc.save(`${formatDate(new Date())}HotelBills.pdf`)
    
  }
  const handleSimCardBillPrint = () => {

  }
  const handleAssetBillPrint = () => {

  }
  const handleStaffVehicleBillPrint = () => {

  }
  const handleCommercialBillPrint = () => {

  }
  const handleManPowerBillPrint = () => {

  }

  // Event handler for button click
  const handleButtonClick = () => {
    // Display the selected value
    if(selectedValue === "hotel"){
      handleHotelBillPrint()
    }
    else if(selectedValue === "simcard"){
      handleSimCardBillPrint()
    }
    else if(selectedValue === "asset"){
      handleAssetBillPrint()
    }
    else if(selectedValue === "makeAndModel"){
      handleStaffVehicleBillPrint()
    }
    else if(selectedValue === "vehicle"){
      handleCommercialBillPrint()
    }
    else if(selectedValue === "manPower"){
      handleManPowerBillPrint()
    }
    else{
      alert("here in else block")
    }
  };

  // Event handler for dropdown change
  const handleDropdownChange = (event) => {
    // Update the selected value in the state
    setSelectedValue(event.target.value);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> MIS - Reports </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
      <FormControl fullWidth sx={{marginRight: 2}}>
        {/* Label for the dropdown */}
        <InputLabel id="demo-simple-select-label">Select Any Bills</InputLabel>
        {/* Material-UI Select component for the dropdown */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedValue}
          label="Select Any Bills"
          onChange={handleDropdownChange}
        >
          {/* Dropdown options */}
          <MenuItem value="hotel">Hotel Bills</MenuItem>
          <MenuItem value="simcard">Sim Card Bills</MenuItem>
          <MenuItem value="asset">Asset Bills</MenuItem>
          <MenuItem value="makeAndModel">Staff Vehicle Bills</MenuItem>
          <MenuItem value="vehicle">Commercial Vehicle Bills</MenuItem>
          <MenuItem value="manPower">Man Power Bills</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleButtonClick}>
        Get Reports
      </Button>
      </Box>
      
    </Container>
  );
}
