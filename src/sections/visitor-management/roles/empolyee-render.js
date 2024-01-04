/* eslint-disable */
import { Container, Grid, LinearProgress } from "@mui/material";
import { _bookings } from "src/_mock";
import { useSettingsContext } from "src/components/settings";
import { useEffect, useState } from "react";
import axios from "axios";
import VisitorDetails from "./employee/visitor-details-table";
import { useVisitorContext } from "src/context/visitor_context";
import { height } from "@mui/system";
import WidgetSummary from "src/components/widget/widget-summary";

export default function EmployeeRender() {
  const [type, setType] = useState("total"); // in or out
  const [tableData, setTableData] = useState("");
  const [inCount, setInCount] = useState(0);
  const [outCount, setOutCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currVisitors, setCurrVisitors] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const { addVisitorFlag, deleteVisitorFlag, editVisitorFlag } =
    useVisitorContext();

  const getVisitors = async () => {
    try {
      let last = "";
      if (type === "in") {
        last = "inVisitor";
      } else if (type === "out") {
        last = "outVisitor";
      } else {
        last = "getTodayVisitorForEmp";
      }

      const URL = `http://localhost:5000/api/v1/visitor/${sessionStorage.getItem(
        "id"
      )}/${last}`;
      console.log("here in got visitors : ", URL);
      const res = await axios.get(URL);
      console.log("got results in visitors : ", res.data.data);

      setCurrVisitors(res?.data?.data);
    } catch (err) {
      alert("something went wrong");
      console.log(err);
    }
    setApiCalled(true);
  };

  const getInCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/visitor/${sessionStorage.getItem(
          "id"
        )}/inVisitor`
      );
      console.log(res);
      setInCount(res.data.count);
    } catch (err) {
      alert("something went wrong");
      console.log(err);
    }
  };
  const getOutCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/visitor/${sessionStorage.getItem(
          "id"
        )}/outVisitor`
      );
      setOutCount(res.data.count);
    } catch (err) {
      alert("something went wrong");
      console.log(err);
    }
  };
  const getToatalCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/visitor/${sessionStorage.getItem(
          "id"
        )}/getTodayVisitorForEmp`
      );
      setTotalCount(res.data.count);
    } catch (err) {
      alert("something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    getInCount();
    getOutCount();
    getToatalCount();
    getVisitors();
  }, []);

  useEffect(() => {
    getVisitors();
    getInCount();
    getOutCount();
    getToatalCount();
  }, [type, addVisitorFlag, deleteVisitorFlag, editVisitorFlag]);

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      {/* Cards */}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 3, sm: 5, md: 5 }}
        justifyContent="center"
        gap={5}
      >
        <Grid xs={12} sm={6} md={3}>
          <div
            onClick={() => {
              setType("in");
            }}
          >
            <WidgetSummary
              title="In Visitors"
              total={inCount}
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />
              }
            />
          </div>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <div
            onClick={() => {
              setType("out");
            }}
          >
            <WidgetSummary
              title="Out Visitors"
              total={outCount}
              color="info"
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
              }
            />
          </div>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <div
            onClick={() => {
              setType("total");
            }}
          >
            <WidgetSummary
              title="Total Visitors"
              total={totalCount}
              color="warning"
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />
              }
            />
          </div>
        </Grid>
      </Grid>

      {/* Table */}
      <Grid xs={12} marginTop={7}>
        <VisitorDetails
          title="Visitor Details"
          tableData={currVisitors}
          isApiCalled={apiCalled}
          tableLabels={[
            { id: "image", label: "image", width: 100 },
            { id: "name", label: "Name" },
            { id: "phone_no", label: "Phone No" },
            { id: "gender", label: "Gender" },
            { id: "is_professional", label: "Professional Visit" },
            { id: "visit_type", label: "Visit Type" },
            { id: "place", label: "Place" },
            { id: "appointment_half", label: "Appointment half" },
            { id: "entry_gate", label: "Entry Gate" },
            { id: "purpose", label: "Purpose" },
            { id: "" },
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
    </Container>
  );
}
