/* eslint-disable */
import { useEffect, useState } from "react";
import { useSettingsContext } from "src/components/settings";
import { useAuthContext } from "src/auth/hooks";
import { useGrievanceContext } from "src/context/grievance_context";
import { useTheme } from '@mui/material/styles';
import { Box, Button, Card, Grid, IconButton, LinearProgress, Stack, Tab, Table, TableBody, TableContainer, Tabs, Tooltip, alpha } from "@mui/material";
import Label from "src/components/label/label";
import axios from "axios";
import {jsPDF} from "jspdf"

import Iconify from "src/components/iconify/iconify";
import Scrollbar from "src/components/scrollbar/scrollbar";
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, emptyRows, useTable, getComparator} from "src/components/table";
import { Container } from "@mui/system";


import SearchBar from "src/components/search/Search-bar";
import PieChart from "./admin/PieChart";
import BarChart from "./admin/BarChart";
import RadialBar from "./admin/radialBar";
import RequisitionActivity from "./admin/RequisitionActivity";
import AdminRequisitionRow from "./admin/admin-requisition-row";



const defaultFilters = {
  name: '',
  status: 'all',
};
const GB = 1000000000 * 24;
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
];

const TABLE_HEAD = [
  { id: 'title', label: 'Requisition Title', width: 200 },
  { id: 'activity', label: 'Activity', width: 200 },
  { id: 'employee', label: 'Employee', width: 200 },
  // { id: 'desc', label: 'Description' },
  { id: 'grievance_date', label: 'Requisition Date', width: 200 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 48 },
  // { id: 'totalAmount', label: 'Price', width: 140 },
  // { id: 'totalQuantity', label: 'Items', width: 120, align: 'center' },
];

export default function AdminRender(){

  const theme = useTheme();

  const { user } = useAuthContext();
  console.log('->user in hod screen grievance',user)

  const {approvedFlag, declinedFlag, addGrievanceFlag} = useGrievanceContext();

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState([]);

  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [radialBarData, setRadialBarData] = useState({});
  const [activityChartData, setActivityChartData] = useState();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("grievance_date")

  const onSort = (id) => {
    console.log("on sort called ");
    console.log("id is : ", id);
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  }

  const [getApiCalled, setGetApiCalled] = useState(false);

    const getAllRequisitions = async() =>{
      try{
        const res = await axios.get(`http://localhost:5000/api/v1/requisition/getAll`)
        console.log('res of getAllRequisitions',res?.data?.data);
        setTableData(res?.data?.data)
      }
      catch(e){
        console.log('errror ',e);
      }
      setGetApiCalled(true);
    }

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

    const handlePrint = async() => {
      const doc = new jsPDF({orientation: "landscape", unit:'mm', format:[600, 600]})

    // const tempHeaders = ["Title", "Activity", "Problem Desc", "Employee Name", "Employee Email", "Requisition Date", "Status", "Escalated", "Resent", "Approval Remarks", "Closure Remarks"];
    const tempHeaders = ["Title", "Activity", "Problem Desc", "Employee Name", "Employee Email", "Requisition Date", "Status", "Escalated", "Resent", "Approval Remarks", "Closure Remarks"];
    // const tempHeaders = ["Name", "Mobile", "Email", "Gender"];
    const headers = tempHeaders.map((header) => {
        return {
            id: header,
            name: header,
            prompt: header
        }
    })
    const URL = `http://localhost:5000/api/v1/requisition/getAll`
    const res = await axios.get(URL);

    const tabled = res?.data?.data.map((el) => {
        console.log("el el : ", el.approval_remarks)
        return {
            Title: el.title,
            Activity: el.activity,
            "Problem Desc": el.problem_desc,
            "Employee Name": el.emp_name,
            "Employee Email": el.emp_email,
            "Requisition Date": formatTimeAndDate(el.requisition_date),
            "Status": el.status,
            "Escalated": (el.is_escalated ? "YES" : "NO"),
            "Resent": (el.is_resend ? "YES" : "NO"),
            "Approval Remarks": (el?.approval_remarks === "" || el?.approval_remarks === undefined) ? "---" : el?.approval_remarks,
            "Closure Remarks": (el?.closure_remarks === "" || el?.closure_remarks === undefined) ? "---" : el?.closure_remarks,
        }
    })


    console.log("tabled data : ")
    console.log(tabled)

    console.log("Header data : ")
    console.log(headers);

    doc.table(1, 1, tabled, headers, {autoSize: true});

    doc.save(`${formatDate(new Date())}Requisition.pdf`)
    }


    const getRadialBarData = async() => {
      try{
        const URL = `http://localhost:5000/api/v1/grievance/analysis/resolved`;
        const res = await axios.get(URL);
        setRadialBarData(res?.data?.data);
      }
      catch(err){
        console.log(err);
      }

    }

    const getActivityChartData = async() => {
      try{
        const URL = `http://localhost:5000/api/v1/grievance/analysis/grouped`
        const res = await axios.get(URL);
        setActivityChartData(res?.data);
      }
      catch(err){
        console.log(err);
      }
    }


    const getPieChartData = async() => {
      try{  
        const URL = `http://localhost:5000/api/v1/grievance/analysis/countStatus`
        const res = await axios.get(URL);

        const generatedData = res?.data?.data.map((el) => {
          return {label: el._id, value: el.count}
        })

        setPieChartData(generatedData);

      }
      catch(err){
        console.log(err);
      }

    }


    const getBarChartData = async() => {
      try{  
        const URL = `http://localhost:5000/api/v1/grievance/analysis/empCountGrievance`
        const res = await axios.get(URL);
        setBarChartData(res?.data?.data);
      }
      catch(err){
        alert("something went wrong in bar chart");
        console.log(err);
      }

    }

    
    useEffect(() => {
      getAllRequisitions();
      getPieChartData();
      getBarChartData();
      getRadialBarData();
      getActivityChartData();
    }, [])
    
    useEffect(() => {
      getAllRequisitions();
      getPieChartData();
      getBarChartData();
      getRadialBarData();
      getActivityChartData();
    }, [approvedFlag, declinedFlag, addGrievanceFlag])
    
    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filters,
    });

    const handleFilters = (name, value) => {
        setFilters((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    }

    const handleFilterStatus = 
      (event, newValue) => {
        console.log("handle filter status called : ", newValue);
        handleFilters('status', newValue);
        setPage(0);
      }
    
    const handleViewRow = () =>{

    } 

    const notFound = !dataFiltered.length;

    console.log(tableData);
    return(
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{width: '95%'}}>
        

        <Card >
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              marginBottom: 2,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'approved' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'declined' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && tableData?.length}
                    {tab.value === 'approved' &&
                      tableData?.filter((item) => item.status === 'approved').length}

                    {tab.value === 'pending' &&
                      tableData?.filter((item) => item.status === 'pending').length}

                    {tab.value === 'declined' &&
                      tableData?.filter((item) => item.status === 'declined').length}
                    
                  </Label>
                }
              />
            ))}
          </Tabs>
            
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <SearchBar
            filters={filters}
            onFilters={handleFilters}
            placeholder="complaint, name and email "
          />

          <Button
          sx={{fontSize: 13, py: 2}}
          size="small"
          color="inherit"
          onClick={handlePrint}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} />}
          >
          Print Requisitions
        </Button>

          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
           
            <Scrollbar>
            {getApiCalled ?
              <Table size= 'medium'/* {table.dense ? 'small' : 'medium'} */ sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  order={order}
                  orderBy={orderBy}
                  // numSelected={table.selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => (
                      <AdminRequisitionRow
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        // key={row.id}
                        // selected={table.selected.includes(row.id)}
                        // onSelectRow={() => table.onSelectRow(row.id)}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  {/* <TableEmptyRows
                    height={72}
                    emptyRows={emptyRows(Math.ceil(tableData.length/5), 5, tableData.length)}
                  /> */}

                  <TableNoData notFound={notFound} />
    
                </TableBody>
              </Table> : <div><LinearProgress/></div>
            }  
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            // count={dataFiltered.length}
            count={dataFiltered.length}
            // page={table.page}
            page={page}
            // rowsPerPage={table.rowsPerPage}
            rowsPerPage={rowsPerPage}
            // onPageChange={table.onChangePage}
            onPageChange={(e, newPage) => {
              setPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              setPage(0);
              setRowsPerPage(parseInt(e.target.value, 10));
            }}
            //
            // dense={table.dense}
            // onChangeDense={table.onChangeDense}
          />


          {/* <Grid xs={12} md={6} lg={4}> */}
        <Grid container spacing={3} >

            <Grid xs={12} sm={6} md={8} sx={{mt: 10}}>
              {
                barChartData ? 

              <BarChart
              title="Grievance Distribution"
              chart={{
                series: barChartData
              }}
              /> : <LinearProgress/>

              }
            </Grid>
            <Grid xs={12} sm={6} md={3} sx={{ml:10, mt: 10}}>
              {radialBarData ? 
                <RadialBar
                total={{resolvedCount: radialBarData?.resolvedCount, total:radialBarData?.total}}
                chart={{
                  series: radialBarData.resolvedPercentage ? radialBarData.resolvedPercentage: 0,
                }}
                data={[
                  {
                    name: 'Resolved',
                    count: parseInt(radialBarData?.resolvedCount, 10),
                    
                    
                  },
                  {
                    name: 'Pending',
                    count: parseInt(radialBarData?.pendingCount, 10),
                   
                  },
                ]}
                /> : <></>}
              </Grid>
  
        </Grid>


          <Grid xs={12} md={6} lg={4}>

            {
              pieChartData ? 
            
          <PieChart
            title="Grievance Status"
            chart={{
              series: pieChartData
            }}
          /> : <LinearProgress/>

        }
          </Grid>


          <Grid xs={12} md={6} lg={4}>

            {
              activityChartData ? 
            
              <RequisitionActivity
              title="Data Activity"
              chart={{
                labels: {
                  year: activityChartData?.labels,
                },
                colors: [
                  theme.palette.primary.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                  theme.palette.text.disabled,
                ],
                series: [
                  {
                    type: "Grievance",
                    data:activityChartData?.data
                  }
                ],
              }}
              
              /> : <LinearProgress/>

            }
          </Grid>
          
        </Card>
      </Container>
    );
}

function applyFilter({ inputData, comparator, filters}) {
  const { status, name} = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.title.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.by_whom_id.emp_name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.by_whom_id.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }


  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }
  console.log(filters,'&&&&&&&&&&&&',inputData)
  return inputData;
}
