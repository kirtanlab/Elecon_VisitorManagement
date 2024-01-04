/* eslint-disable */
import { Container, Grid, LinearProgress } from "@mui/material";
import { _bookings} from "src/_mock";
import { useSettingsContext } from "src/components/settings";
import { useEffect, useState } from "react";
import axios from "axios";
import VisitorDetails from "./employee/visitor-details-table";
import VisitorWidgetSummary from "../visitor-widget-summary";
import { useVisitorContext } from "src/context/visitor_context";
import VisitorDetailsGateUser from "./gateUser/visitor-details-table-gateUser";
import { useAuthContext } from "src/auth/hooks";


export default function GateuserRender(){

    const [type, setType] = useState("total");
    const [tableData, setTableData] = useState("");
    const [inCount, setInCount] = useState(0);
    const [outCount, setOutCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currVisitors, setCurrVisitors] = useState(null); 
    const {addVisitorFlag, deleteVisitorFlag, editVisitorFlag, editVisitorFlagGateUser ,outGateUser ,inGateUser}  = useVisitorContext();

    const {user} = useAuthContext();
    console.log("Gate user render screen", user)
    
    const entryGate = {entry_gate:user?.gate_name}
    
    const getVisitors = async() => {
      try{
        let last = "";
        if(type === "in"){
          last = "getInTimeVisitorForGateUser"
        }
        else if(type === "out"){
          last = "getOutTimeVisitorForGateUser"
        }
        else{
          last = "getTodayVisitorForGateUser"
        }
        const res = await axios.post(`http://localhost:5000/api/v1/gateUser/${last}`,entryGate);
        console.log("here in get visitors in gateUser : ", res);
        setCurrVisitors(res.data.data);
      }
      catch(err){
        console.log("total vali error ",err);
      } 
    }

    const getInCount = async() => {
      try{
        const res = await axios.post(`http://localhost:5000/api/v1/gateUser/getInTimeVisitorForGateUser`,entryGate);
        console.log(res)
        setInCount(res.data.count);
      }
      catch(err){
        console.log(err);
      }
    }
    const getOutCount = async() => {
      try{
        const res = await axios.post(`http://localhost:5000/api/v1/gateUser/getOutTimeVisitorForGateUser`,entryGate);
        setOutCount(res.data.count);
      }
      catch(err){
        console.log(err);
      }
    }
    const getToatalCount = async() => {
      try{
        const res = await axios.post(`http://localhost:5000/api/v1/gateUser/getTodayVisitorForGateUser`,entryGate);
        setTotalCount(res.data.count);
      }
      catch(err){
        console.log(err);
      }
    }

    useEffect(() => {
      console.log("useEffect called in gateuser");
      getInCount()
      getOutCount()
      getToatalCount()
      getVisitors();
    }, [])

    useEffect(() => {
      getVisitors();
      getInCount()
      getOutCount()
      getToatalCount()
    }, [type, addVisitorFlag, deleteVisitorFlag, editVisitorFlag, editVisitorFlagGateUser,inGateUser,outGateUser])

    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
           {/* Cards */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 3, sm: 5, md: 5 }}
            justifyContent="center"
            gap={5}
          >
            <Grid xs={12} sm={6} md={3}>
              <div onClick={() => {setType("in")}}>
                <VisitorWidgetSummary
                  title="In Visitors"
                  total={inCount}
                  icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
                  onClicl
                  
                />
              </div>
            </Grid>
  
            <Grid xs={12} sm={6} md={3}>
              <div onClick={() => {setType("out")}}>
                <VisitorWidgetSummary
                  title="Out Visitors"
                  total={outCount}
                  color="info"
                  icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
                />

              </div>
            </Grid>
  
            <Grid xs={12} sm={6} md={3}>
              <div onClick={() => {setType("total")}}>

              <VisitorWidgetSummary
                title="Total Visitors"
                total={totalCount}
                color="warning"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
              />
              </div>
            </Grid>
          </Grid>
          
          {/* Table */}
          {
            currVisitors ?
            <Grid xs={12} marginTop={7}>
              
              <VisitorDetailsGateUser
                title="Visitor Details"
                tableData={currVisitors}
          
                tableLabels={[
                  { id: 'name', label: 'Name' },
                  { id: 'phone_no', label: 'Phone No' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'to_whom_id', label: 'To Whom'},
                  { id: 'is_professional', label: 'Professional Visit' },
                  { id: 'place', label: 'Place'},
                  { id: 'appointment_half', label: 'Appointment half'},
                  { id: 'in_time', label: 'In Time'},
                  { id: 'out_time', label: 'Out Time'},
                  { id:""},
                ]}

                // tableLabels={[
                  //   { id: 'Name', label: 'Name' },
                  // { id: 'Entry Gate', label: 'Entry Gate'},
                  // { id: 'From Date', label: 'From Date' },
                  // { id: 'To Whom', label: 'To Whom'},
                  // { id: 'Purpose', label: 'Purpose'},
                  // { id: 'To Date', label: 'To Date' },
                  // { id: 'Guest Company', label: 'Guest Company'},
                  // { id: 'Designation', label: 'Designation'},
                  // { id: 'Visit Type', label: 'Visit Type' },
                //   { id: 'Phone No', label: 'Phone No' },
                //   { id: 'Gender', label: 'Gender' },
                //   { id: 'Professional Visit', label: 'Professional Visit' },
                //   { id: 'Visit Type', label: 'Visit Type' },
                //   { id: 'From Date', label: 'From Date' },
                //   { id: 'To Date', label: 'To Date' },
                //   { id: 'Place', label: 'Place'},
                //   { id: 'Appointment half', label: 'Appointment half'},
                //   { id: 'Entry Gate', label: 'Entry Gate'},
                //   { id: 'In Time', label: 'In Time'},
                //   { id: 'Out Time', label: 'Out Time'},
                //   { id: 'To Whom', label: 'To Whom'},
                //   { id: 'Purpose', label: 'Purpose'},
                //   { id: 'Guest Company', label: 'Guest Company'},
                //   { id: 'Designation', label: 'Designation'},
                // ]}
              />
            </Grid> :  <div style={{margin:"50px"}}><LinearProgress/></div>
          }
        </Container>
      );
}

