/* eslint-disable */
import { useEffect, useState } from "react";
import { useSettingsContext } from "src/components/settings";
import { useAuthContext } from "src/auth/hooks";
import { useGrievanceContext } from "src/context/grievance_context";
import { Button, Card, Dialog, Divider, IconButton, InputBase, LinearProgress, Tab, Table, TableBody, TableContainer, Tabs, Tooltip, alpha, dialogClasses } from "@mui/material";
import Label from "src/components/label/label";
import axios from "axios";

import Scrollbar from "src/components/scrollbar/scrollbar";
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, emptyRows, useTable, getComparator} from "src/components/table";
import { Box, Container } from "@mui/system";
import ComplaintTableRowForEmp from "./employee/complaint-table-row-emp";
import Iconify from "src/components/iconify/iconify";
import { useTheme } from "@emotion/react";
import { useAdminMISContext } from "src/context/admin_mis_context";
import AddComplaintForm from "./employee/add-requisition-form";
import SearchBar from "./admin/Search-bar";
import AddRequisitionForm from "./employee/add-requisition-form";

const defaultFilters = {
  name: '',
  status: 'all',
};
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
];

const TABLE_HEAD = [
  { id: 'title', label: 'Requisition Title', width: 200},
  { id: 'activity', label: 'Activity', width: 100},
//   { id: 'name', label: 'Employee', width: 100 },
  { id: 'requisition_date', label: 'Requisition Date' ,width: 170},
  { id: 'status', label: 'Status',width: '10%'},
  { id: '', width: 150},
  { id: '', width: 48 },
];


export default function EmployeeRender(){

  const { user } = useAuthContext();
  console.log('->user in employee screen grievance',user)

  const {approvedFlag, declinedFlag, addGrievanceFlag,setAddGrievanceFlag, } = useGrievanceContext();
  const {addDepartmentFlag} = useAdminMISContext()

//   const table = useTable({ defaultOrderBy: 'orderNumber' });
  const theme = useTheme();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState([]);
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

    const complaintOfEmp = async() =>{
      try{
        const res = await axios.get(`http://localhost:5000/api/v1/requisition/${user._id}/getAll`)
        console.log("got result : ", res?.data);
        console.log('res of complaintOfEmp',res?.data?.data);
        
        setTableData(res?.data?.data)
      }
      catch(e){
        console.log('errror ',e);
      }
      setGetApiCalled(true);
    }

    useEffect(() => {
      complaintOfEmp();
    }, [])

    useEffect(() => {
      complaintOfEmp();
    }, [approvedFlag, declinedFlag, addGrievanceFlag, addDepartmentFlag])
    
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

    // const handleFilterStatus = (event, newValue) => {
    //     setPage(0);
    //     setFilters(newValue);
    //   };
    
    const handleViewRow = () =>{

    } 

    const renderAddRequisition = () =>{
      return (
        <>
          <AddRequisitionForm/>
        </>
      )
    }

    const notFound = !dataFiltered.length;

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
            {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
            

            <Box sx={{ p: 2, textAlign: 'right',float:'right',width: '100%' }}>
              <Button
                  size="small"
                  color="inherit"
                  onClick={() => {setAddGrievanceFlag(true)}}
                  endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
              >
                  Add Requisition
              </Button>

            </Box>
          </Tabs>

          <SearchBar
              filters={filters}
              onFilters={handleFilters}
            />

          <Dialog
              fullWidth
              maxWidth="xl"
              // open={flag.value}
              open={addGrievanceFlag}
              onClose={() => {setAddGrievanceFlag(false)}}
              transitionDuration={{
                  enter: theme.transitions.duration.shortest,
                  exit: 0,
              }}
              PaperProps={{
                  sx: {
                  mt: 15,
                  overflow: 'unset',
                  },
              }}
              sx={{
                  [`& .${dialogClasses.container}`]: {
                  alignItems: 'flex-start',
                  },
              }}
              >
              <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
                  <InputBase
                  fullWidth
                  autoFocus
                  placeholder="Add Complaint"
                  value={''}
                  onChange={() => {
                      '';
                  }}
                  
                  endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                  inputProps={{
                      sx: { typography: 'h6' },
                  }}
                  />
                </Box>

              <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderAddRequisition()}</Scrollbar>
          </Dialog>

          {/* Table */}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
           
            <Scrollbar>
            {getApiCalled ?
              <Table size= 'medium'/* {table.dense ? 'small' : 'medium'} */ sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  order={order}
                  orderBy={orderBy}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => (
                      <ComplaintTableRowForEmp
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
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
             count={dataFiltered.length}   
             page={page}
             rowsPerPage={rowsPerPage}
             onPageChange={(e, newPage) => {
               setPage(newPage);
             }}
             onRowsPerPageChange={(e) => {
               setPage(0);
               setRowsPerPage(parseInt(e.target.value, 10));
             }}
          />
          
        </Card>
      </Container>
    );
}

function applyFilter({ inputData, comparator, filters}) {

  // console.log("inputData --- " , inputData);
  // console.log("comparator --- " , comparator);
  // console.log("filters --- " , filters);
  const { status, name} = filters;
  
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  // console.log("stabilizedThis --- " , stabilizedThis);

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
        order.activity.toLowerCase().indexOf(name.toLowerCase()) !== -1 
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }
  console.log(filters,' ---- ',inputData)
  return inputData;
}
