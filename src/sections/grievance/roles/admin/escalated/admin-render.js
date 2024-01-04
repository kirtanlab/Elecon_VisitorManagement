/* eslint-disable */
import { useEffect, useState } from "react";
import { useSettingsContext } from "src/components/settings";
import { useAuthContext } from "src/auth/hooks";
import { useGrievanceContext } from "src/context/grievance_context";
import { Card, IconButton, LinearProgress, Tab, Table, TableBody, TableContainer, Tabs, Tooltip, alpha } from "@mui/material";
import Label from "src/components/label/label";
import axios from "axios";

import Scrollbar from "src/components/scrollbar/scrollbar";
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, emptyRows, useTable, getComparator} from "src/components/table";
import { Container } from "@mui/system";

import SearchBar from "../../admin/Search-bar";
import GrievanceTableRow from "./escalated-grievance-row";

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
  { id: 'title', label: 'Requisition Title', width: 150 },
  { id: 'activity', label: 'Activity', width: 100 },
  { id: 'employee', label: 'Employee', width: 100 },
  // { id: 'desc', label: 'Description' },
  { id: 'requisition_date', label: 'Date', width: 100 },
  { id: 'status', label: 'Status', width: 180 },
  { id: '', width: 40 },
  // { id: 'totalAmount', label: 'Price', width: 140 },
  // { id: 'totalQuantity', label: 'Items', width: 120, align: 'center' },
];

export default function AdminRender(){

  const { user } = useAuthContext();
  console.log('->user in hod screen grievance',user)

  const {approvedFlag, declinedFlag, addGrievanceFlag} = useGrievanceContext();

  // const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);
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

  const [tableData, setTableData] = useState([]);

  const [getApiCalled, setGetApiCalled] = useState(false);

    const getAllEscalatedGrievance = async() => {
      try{
        const res = await axios.get(`http://localhost:5000/api/v1/grievance/admin/escalated/getAll`)
        console.log('res of getAllEscalatedGrievance',res?.data?.data);
        setTableData(res?.data?.data)
      }
      catch(e){
        console.log('errror ',e);
      }
      setGetApiCalled(true);
    }

    useEffect(() => {
      getAllEscalatedGrievance();
    }, [])

    useEffect(() => {
      getAllEscalatedGrievance();
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

    return(
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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

          <SearchBar
              filters={filters}
              onFilters={handleFilters}
          />

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
                      <GrievanceTableRow
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
        order.grievance_type.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.emp_name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.emp_email.toLowerCase().indexOf(name.toLowerCase()) !== -1 
    );
  }


  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }
  // console.log(filters,'&&&&&&&&&&&&',inputData)
  return inputData;
}
