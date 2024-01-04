/* eslint-disable */
import { Container, Grid, LinearProgress } from "@mui/material";
import { _bookings } from "src/_mock";
import { useSettingsContext } from "src/components/settings";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { useVisitorContext } from "src/context/visitor_context";
import AdminVisitorDetails from "./admin/admin-visitor-details";
import AdminVisitorChart from "./admin/admin-visitor-chart";

export default function AdminRender() {
  const { setAdminVisitorDate, adminVisitorDate } = useVisitorContext();
  const [currVisitors, setCurrVisitors] = useState([]);

  console.log("curr visitors ", currVisitors);
  const [dateFlag, setDateFlag] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);
  const [lineChartData, setLineChartData] = useState([]);

  const getVisitors = async () => {
    try {
      const gotDate = adminVisitorDate.format("YYYY-MM-DD");
      const URL = `http://localhost:5000/api/v1/visitor/byDate`;
      const res = await axios.post(URL, {
        date: gotDate,
      });
      setCurrVisitors(res.data.data);
      setApiCalled(true);
    } catch (error) {
      console.log("error in get today visitors", error);
      alert("some error occured in get visitors api ");
    }
  };

  const getLineChartData = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/visitor/analysis/monthViseCount`;
      const res = await axios.get(URL);
      setLineChartData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("here in useeffect : ", adminVisitorDate.format("YYYY-MM-DD"));
    getVisitors();
    getLineChartData();
  }, []);

  useEffect(() => {
    console.log("here in useeffect : ", adminVisitorDate.format("YYYY-MM-DD"));
    getVisitors();
    getLineChartData();
  }, [dateFlag]);

  const settings = useSettingsContext();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : "xl"}
      sx={{ width: "95%" }}
    >
      {/* Cards */}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }}
        justifyContent="left"
        gap={5}
      >
        <Grid xs={12} sm={6} md={3}>
          {/* date picker for perticular date */}

          <DatePicker
            label="Select Date Here"
            value={adminVisitorDate}
            onChange={(newDate) => {
              // console.log("here in ", dayjs(newDate));
              setDateFlag(!dateFlag);
              setAdminVisitorDate(dayjs(newDate));
            }}
          />
        </Grid>
      </Grid>

      {/* Table */}
      {
        <Grid xs={12} marginTop={4}>
          <AdminVisitorDetails
            title="Visitor Details"
            tableData={currVisitors}
            isApiCalled={apiCalled}
            tableLabels={[
              { id: "name", label: "Name", width: 100 },
              { id: "phone_no", label: "Phone No", width: 100 },
              { id: "gender", label: "Gender", width: 105 },
              {
                id: "is_professional",
                label: "Professional Visit",
                width: 135,
              },
              { id: "visit_type", label: "Visit Type", width: 100 },
              { id: "place", label: "Place", width: 90 },
              { id: "appointment_half", label: "Appointment half", width: 128 },
              { id: "entry_gate", label: "Entry Gate", width: 105 },
              { id: "purpose", label: "Purpose", width: 70 },
              { id: "", width: 0 },
              // { id: 'From Date', label: 'From Date' },
              // { id: 'To Date', label: 'To Date' },
              // { id: 'In Time', label: 'In Time'},
              // { id: 'Out Time', label: 'Out Time'},
              // { id: 'To Whom', label: 'To Whom'},
              // { id: 'Guest Company', label: 'Guest Company'},
              // { id: 'Designation', label: 'Designation'},
            ]}
          />
        </Grid>
      }

      <Grid xs={12} md={6} lg={8} marginTop={7}>
        {getLineChartData ? (
          <AdminVisitorChart
            title="Visitor Chart"
            subheader="Visitor Count Based On Employees"
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              // series: [
              //   {
              //     year: '2019',
              //     data: [
              //       {
              //         name: 'Total Income',
              //         data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
              //       },
              //       {
              //         name: 'Total Expenses',
              //         data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
              //       },
              //     ],
              //   },
              //   {
              //     year: '2020',
              //     data: [
              //       {
              //         name: 'Total Income',
              //         data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
              //       },
              //       {
              //         name: 'Total Expenses',
              //         data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
              //       },
              //     ],
              //   },
              // ],
              series: lineChartData,
            }}
          />
        ) : (
          <LinearProgress />
        )}
      </Grid>
    </Container>
  );
}
