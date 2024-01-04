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
import { useVisitorContext } from 'src/context/visitor_context';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

export default function AddressListDialog() {

    const [visitor, setVisitor] = useState(null);
    const {visitorId} = useVisitorContext();

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
    const formatTimeAndDate = (d) => {
        var now = new Date(d)
        var date = now.toLocaleDateString();
        var time = now.toLocaleTimeString();
        return `${date}  ${time}`
    }

    const getVisitor = async() => {
        console.log("called getvisitor");
        try{
            const URL = `http://localhost:5000/api/v1/visitor/${visitorId}`
            const res = await axios.get(URL)
            const emp_id = res.data.data.to_whom_id;

            const t = await axios.get(`http://localhost:5000/api/v1/employee/${emp_id}`);
            const to_whom = t.data.data.emp_name

            const tempVisitor = []
            const got = res.data.data;
            for(const key in got){
                if(key === "from_date" || key == "to_date"){
                    tempVisitor.push({key, value: formatDate(got[key])});
                }
                else if(key === "in_time" || key === "out_time"){
                    console.log("under in out time");
                    console.log(got[key])
                    console.log(typeof got[key])
                    if(!got[key]){
                        tempVisitor.push({key: key, value: "remaining"})
                    }
                    else{
                        tempVisitor.push({key: key, value: formatTimeAndDate(got[key])})
                    }
                }
                else if(key === "is_professional"){
                    tempVisitor.push({key: key, value: got[key] ? "YES" : "NO"})
                }
                else if(key === "to_whom_id"){
                    tempVisitor.push({key: key, value: to_whom})
                }
                else if(key === "name" || key === "phone_no" || key === "email_id" || key === "gender" || key === "is_professional" || key === "designation" || key === "guest_company" || key === "place" || key === "visit_type" || key === "purpose" || key === "appointment_half"){
                    if(got[key] === ""){
                        tempVisitor.push({key: key, value: "-----"})
                    }
                    else{
                        tempVisitor.push({key: key, value: got[key]})

                    }

                }
                else{
                    continue;
                }
               
            }

            console.log("temp visitors", tempVisitor);
            setVisitor(tempVisitor);
        }
        catch(err){
            alert("something went wrong");
            console.log(err);
        }
    }

    useEffect(() => {
        getVisitor()
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
            visitor ? visitor.map((atr, index) => {
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

AddressListDialog.propTypes = {
  
};




