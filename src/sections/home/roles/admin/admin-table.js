/* eslint-disable */
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, Container, Grid, LinearProgress, Typography, alpha } from "@mui/material";
import { useSettingsContext } from "src/components/settings";
import { useVisitorContext } from "src/context/visitor_context";
import BarChart from "src/sections/grievance/roles/admin/BarChart";
import EmpDetails from "./admin-emp-table";


export default function AdminTable(){

    const [currEmp, setCurrEmp] = useState(null);
    const [barChartData, setBarChartData] = useState([]);
    const [apiCalled, setApiCalled] = useState(false);

    const getAllEmp = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/employee/getAll`
            const res = await axios.get(URL);
            console.log("before calling api");
            const gotData = res?.data?.data.map((el) => {
              return {...el, company: el?.company?.company_name, department: el?.department?.department_name, division: el?.division?.division_name}
            })
            console.log("got all data error ", gotData);
            // setCurrEmp(res?.data?.data);
            setCurrEmp(gotData);
            setApiCalled(true);
        }
        catch(err){
            alert("something went wrong get all emps")
            console.log(err);
        }

    }   

    const {addEmpFlag, editEmpFlag, deleteEmpFlag} = useVisitorContext()

    const settings = useSettingsContext();

    const getBarChartData = async() => {
      try{
        const URL = `http://localhost:5000/api/v1/employee/analysis/countBasedOnRole`
        const res = await axios.get(URL);
        setBarChartData(res?.data?.data);
      }
      catch(err){
        console.log(err);
      }
    }


    useEffect(() => {
        getAllEmp();
        getBarChartData();
    }, [])

    useEffect(() => {
        getAllEmp();
        getBarChartData();
    }, [addEmpFlag, editEmpFlag, deleteEmpFlag])

    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{width: '95%'}}>
     
     {/* Table */}
       <Grid xs={12} marginTop={1}>
         <EmpDetails
           title="User Details"
           tableData={currEmp}
           isApiCalled = {apiCalled}
           tableLabels={[
             { id: 'emp_id', label: 'Emp ID', width: 130 },
             { id: 'emp_name', label: 'Name', width: 170 },
             { id: 'email', label: 'Email', width: 250 },
             { id: 'phoneNumber', label: 'Phone No', width: 170 },
             { id: 'role', label: 'Role', width: 170 },
             { id: 'company', label: 'Company', width: 130 },
             { id: 'division', label: 'Division', width: 130 },
             { id: 'department', label: 'Department', width: 130 },
            //  { id: 'gate_name', label: 'Gate Name', width: 160 },
             { id:"", width: 40}, 
           ]}
         />
       </Grid> 

    {
     barChartData ? 
     <Grid xs={12} marginTop={1}>
       <BarChart
        title="Employee Distribution"
        chart={{
          series: barChartData
        }}
      />
     </Grid> : <LinearProgress/>
    }

   </Container>
  );
}