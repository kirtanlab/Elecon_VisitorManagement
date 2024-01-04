/* eslint-disable */
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';;
import Typography from '@mui/material/Typography';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
// components
import axios from 'axios';
import { useVisitorContext } from 'src/context/visitor_context';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

export default function ShowDetailsDialog() {

    const [emp, setEmp] = useState(null);
    const {empId} = useVisitorContext();

    const getEmp = async() => {
        console.log("called getvisitor");
        try{
            const URL = `http://localhost:5000/api/v1/employee/${empId}`
            const res = await axios.get(URL)

            const tempEmp = []
            const got = res.data.data;
            for(const key in got){
                if(key === "_id" || key === "__v" || key === "visitors" || key === "created_date" || key === "created_by" || key === "updated_date" || key === "updated_by" || key === "deleted_date" || key === "deleted_by" || key === "hod_emp_id" || key==="company_name" || key === "emp_extention"){
                    continue;
                }
                else if(key === "company" || key === "division" || key === "department"){
                  tempEmp.push({key, value: got[key][`${key}_name`]})
                }
                else if(key === "hod_id"){
                  tempEmp.push({key:"HOD",value:got[key]["emp_name"]})
                }
                else{
                  if(got[key] === ""){
                      tempEmp.push({key: key, value: "-----"})
                  }
                  else{
                      tempEmp.push({key: key, value: got[key]});
                  }
                }
            }
            console.log("temp emp", tempEmp);
            setEmp(tempEmp);
        }
        catch(err){
            alert("something went wrong")
            console.log(err);
        }
    }

    useEffect(() => {
        getEmp()
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
          emp ? emp.map((atr, index) => {
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

ShowDetailsDialog.propTypes = {
  
};




