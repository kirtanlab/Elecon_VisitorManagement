/* eslint-disable */
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import { useGrievanceContext } from 'src/context/grievance_context';

// ----------------------------------------------------------------------

export default function ViewComplaintDialog() {

    const [grievance, setGrievance] = useState(null);
    const {complaintId} = useGrievanceContext();

    const formatTimeAndDate = (d) => {
        var now = new Date(d)
        var date = now.toLocaleDateString();
        var time = now.toLocaleTimeString();
        return `${date}  ${time}`
    }

    
    const getGrievance = async() => {
        try{
            console.log("get grievance 1");
            const res = await axios.get(`http://localhost:5000/api/v1/grievance/specific/${complaintId}`);
            console.log("get grievance 2");
            const URL1 = `http://localhost:5000/api/v1/employee/${res?.data?.data?.by_whom_id?.hod_id}`;
            const res1 = await axios.get(URL1)
            console.log("res1 URL", URL1)
            const tempGrievance = [];
            const got = res?.data?.data
            console.log("get grievance 3");
            for(const key in got){
                if(key === "by_whom_id"){
                    tempGrievance.push({key: "Employee Name", value: got[key]?.emp_name}) 
                    tempGrievance.push({key: "Employee Email", value: got[key]?.email}) 
                    tempGrievance.push({key:"HOD Name", value:res1?.data?.data?.emp_name})
                    tempGrievance.push({key:"HOD Email", value:res1?.data?.data?.email})
                }
                else if(key === "grievance_date"){
                    tempGrievance.push({key:"Grievance Date", value: formatTimeAndDate(got[key])})
                }
                else if(key === "title" || key === "message" || key === "status"){
                    tempGrievance.push({key, value: got[key]})
                }
            }
            setGrievance(tempGrievance);
        }
        catch(err){
          console.log("here in temp grievance errr", err);
            console.log(err);
        }

    }

    useEffect(() => {
        getGrievance()
    }, [])



  return (
    <Stack
      spacing={0.5}
      sx={{
        p: 0.5,
        maxHeight: 80 * 8,
        // overflowX: 'hidden',
      }}
    >
        {
            grievance ? grievance.map((atr, index) => {
                return (
                    <Stack
          key={index}
          spacing={0.5}
          component={ListItemButton}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{atr?.key}</Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {atr?.value}
          </Typography>
        </Stack>
                )
            }) : <LinearProgress/>
        }
        
    </Stack>
  );
}

ViewComplaintDialog.propTypes = {
  
};




