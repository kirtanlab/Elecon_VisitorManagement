/* eslint-disable */
import { useTheme } from '@mui/material/styles';
import { Button, Container, Grid, LinearProgress, Typography } from "@mui/material";
import { _bookings} from "src/_mock";
import { useRouter } from 'src/routes/hooks';
import { useSettingsContext } from "src/components/settings";
import { useEffect, useState } from "react";
import axios from "axios";
import { useVisitorContext } from "src/context/visitor_context";
import { height } from "@mui/system";
import AppWidgetSummary from "./employee/app-widget-summary";
import GrievanceSummary from './employee/grievance-summary';


export default function EmployeeRender(){

    const theme = useTheme();
    const {addVisitorFlag, deleteVisitorFlag, editVisitorFlag} = useVisitorContext();
    const [visitorCountData, setVisitorCountData] = useState([]);
    const [grievanceCountData, setGrievanceCountData] = useState([]);
    const router = useRouter();

    const getVisitorCounts = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/visitor/analysis/count/${sessionStorage.getItem("id")}`
            const res = await axios.get(URL)
            setVisitorCountData(res?.data?.data)
        }
        catch(err){
            console.log(err);
        }

    }

    const getGrievanceCounts = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/grievance/analysis/count/${sessionStorage.getItem("id")}`
            const res = await axios.get(URL);
            setGrievanceCountData(res?.data?.data)
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getVisitorCounts();
        getGrievanceCounts();
    }, [])

    useEffect(() => {
        getVisitorCounts();
        getGrievanceCounts();
    }, [addVisitorFlag, deleteVisitorFlag, editVisitorFlag])

    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 3, sm: 5, md: 5 }}
            justifyContent="space-between"
            gap={1}
          >
                <Typography
                    variant="h4"
                    sx={{
                    mb: { xs: 3, md: 5 },
                    ml: 20
                    }}
                >
                Visitor Management
                </Typography>
                <Button variant="contained" color="primary" sx={{height: 40, mr: 20}} onClick={() => {
                    router.push("/dashboard/visitor-management")
                }}>
                    See Today's Visitor
               </Button>
            
          </Grid>
         {
            visitorCountData ? 
         
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 3, sm: 5, md: 5 }}
            justifyContent="center"
            gap={5}
          >

            
            
            <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
                title="Visits So Far"
                percent={2.6}
                total={visitorCountData?.visitSoFar ? visitorCountData?.visitSoFar : 0}
                // total={18765}
                chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                }}
            />
              
            </Grid>
  
            <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
                title="Yet To Visit"
                percent={0.2}
                total={visitorCountData?.yetToVisit ? visitorCountData?.yetToVisit : 0}
                // total={4876}
                chart={{
                colors: [theme.palette.info.light, theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                }}
            />

              
            </Grid>
  
            <Grid xs={12} sm={6} md={3}>
             <AppWidgetSummary
                title="Total Visitors"
                percent={-0.1}
                total={visitorCountData?.totalCount ? visitorCountData?.totalCount : 0}
                // total={678}
                chart={{
                colors: [theme.palette.warning.light, theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                }}
            /> 
            </Grid>
          </Grid>
        : <LinearProgress/>  
        }

        <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 3, sm: 5, md: 5 }}
            sx={{mt: 5}}
            justifyContent="space-between"
            gap={1}
          >
                <Typography
                    variant="h4"
                    sx={{
                    mb: { xs: 3, md: 5 },
                    ml: 20
                    }}
                >
                Grievance Management
                </Typography>
                <Button variant="contained" color="primary" sx={{height: 40, mr: 20}} onClick={() => {
                    router.push("/dashboard/grievance")
                }}>
                    See All Grievances
               </Button>
            
          </Grid>

            <Grid xs={12} sm={6} md={3} sx={{mr:20, ml:15}}>
                {
                    grievanceCountData ? 
                <GrievanceSummary
                    chart={{
                    series: [
                        { label: 'Pending', percent: (grievanceCountData?.pendingPer ? grievanceCountData?.pendingPer : 0), total: (grievanceCountData?.pendingCount ? grievanceCountData?.pendingCount: 0 )},
                        { label: 'Approved', percent: (grievanceCountData?.approvedPer ? grievanceCountData?.approvedPer : 0), total: (grievanceCountData?.approvedCount ? grievanceCountData?.approvedCount : 0) },
                        { label: 'Declined', percent: (grievanceCountData?.declinedPer ? grievanceCountData?.declinedPer : 0), total: (grievanceCountData?.declinedCount ? grievanceCountData?.declinedCount: 0) },
                    ],
                    }}
                    /> : <LinearProgress/>
                }
            </Grid>
        </Container>
      );
} 