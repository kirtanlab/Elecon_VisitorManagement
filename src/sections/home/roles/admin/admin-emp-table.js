/* eslint-disable */
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';

import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableHeadCustom from 'src/components/table/table-head-custom';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useEffect, useState } from 'react';
import { _bookings } from 'src/_mock';
import { useBoolean } from 'src/hooks/use-boolean';
// import HomeView from '../home/roles/admin-home-view';
import { useVisitorContext } from 'src/context/visitor_context';
import { TablePaginationCustom, getComparator} from 'src/components/table';

import HomeView from './admin-home-view';
import EditEmpView from './admin-edit-emp';
import ShowDetailsDialog from './admin-emp-show-details';
import { Grid, LinearProgress } from '@mui/material';
import SearchBar from 'src/components/search/Search-bar';

// ----------------------------------------------------------------------


export default function EmpDetails({ title, subheader, tableLabels, tableData, isApiCalled,...other }) {

  const theme = useTheme();

  const defaultFilters = {
    name: '',
  };

  const {addEmpFlag, setAddEmpFlag} = useVisitorContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("emp_id")
  const [filters, setFilters] = useState(defaultFilters);

  const onSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  }

  const dataFiltered = isApiCalled ? applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filters,
  }) : {};

  const renderAddEmp = () => {

    return (
      <>
        <HomeView/>
      </>
    )
  } 

  const handleFilters = (name, value) => {
    // console.log('name' + name, ' ', value);
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  return (
    <Card {...other}>
      <Grid container justifyContent={'space-between'}>
       <CardHeader title={title} subheader={subheader} sx={{ mb: 0 }} />
      
        <Button
          sx={{mt: 2.5, mr: 3,}}
          size="small"
          color="inherit"
          onClick={() => {setAddEmpFlag(true)}}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          Add User
        </Button>

        <Dialog
          fullWidth
          maxWidth="lg"
          // open={flag.value}
          open={addEmpFlag}
          onClose={() => {setAddEmpFlag(false)}}
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
              placeholder="Add Employee"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderAddEmp()}</Scrollbar>
        </Dialog>

        <SearchBar filters={filters} onFilters={handleFilters} placeholder="Name or Email" />
      </Grid>

    {isApiCalled ? 
    <Grid>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={tableLabels} 
              order={order}
              orderBy={orderBy}
              onSort={onSort}
            />

            <TableBody>
              {dataFiltered.slice(page * rowsPerPage, page*rowsPerPage + rowsPerPage).map((row, index) => (
                <EmpDetailsRow key={row.id} row={row} index={index}/>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />
      <TablePaginationCustom
            // count={dataFiltered.length}
            count={tableData.length}
            // page={table.page}
            page={page}
            // rowsPerPage={table.rowsPerPage}
            rowsPerPage={rowsPerPage}
            // onPageChange={table.onChangePage}
            onPageChange={(e, newPage) => {
              // console.log("here in page change")
              setPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              console.log("here in rows per page change")
              setPage(0);
              setRowsPerPage(parseInt(e.target.value, 10));
            }}
            //
            // dense={table.dense}
            // onChangeDense={table.onChangeDense}
          />
    </Grid> : <div><LinearProgress/></div> }
    </Card>
  );
}

EmpDetails.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function EmpDetailsRow({ row, index}) {
  const theme = useTheme();

  const {editEmpFlag, deleteEmpFlag, setEditEmpFlag, setDeleteEmpFLag, setEmpId, setEmpShowDetailsFlag, showEmpDetailsFlag, empId} = useVisitorContext()
  const isLight = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDelete = async() => {
    try{
      const URL = `http://localhost:5000/api/v1/admin/deleteEmployee/${row._id}`
      const emp = await axios.delete(URL);
      popover.onClose();
      setDeleteEmpFLag(!deleteEmpFlag)
      
      alert("deleted successfully")
    }
    catch(err){
        alert("not deleted");
      console.log(err);
    }
  };

  const renderEditEmp = () => {

    return (
      <>
        <EditEmpView/>
      </>
    );
  };

  const renderEmpShowDetails = () => {
    return (
      <>
          <ShowDetailsDialog/>
      </>
    )
  }

  useEffect(() => {
    console.log("row row row", row.emp_id);
  }, [])

  return (
    <>
      <TableRow>

        <TableCell>
          <ListItemText
            primary={row.emp_id}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.emp_name}
            // secondary={row.customer.phoneNumber}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.email}
            // secondary={row.customer.phoneNumber}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.phoneNumber?row.phoneNumber:'-----'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.role}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        {/* <TableCell>
          <ListItemText
            primary={row.gate_name? row.gate_name:'-----'}
            // secondary={row.customer.phoneNumber}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell> */}

        <TableCell>
          <ListItemText
            primary={row.company}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.division}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.department}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        
       <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

      </TableRow>

      <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 160 }}
        >
          <MenuItem onClick={() => {setEditEmpFlag(true);setEmpId(row._id);}}>
            <Iconify icon="eva:cloud-download-fill" />
            Edit
            <Dialog
              fullWidth
              maxWidth="lg"
              // open={flag.value}
              open={editEmpFlag}
              onClose={() => {setEditEmpFlag(false)}}
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
                  placeholder="Edit here"
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

              <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderEditEmp()}</Scrollbar>
            </Dialog>
          </MenuItem>

          <MenuItem onClick={() => {setEmpShowDetailsFlag(true);setEmpId(row._id);}}>
            Show Details
            <Dialog
              fullWidth
              maxWidth="sm"
              // open={flag.value}
              open={showEmpDetailsFlag}
              onClose={() => {setEmpShowDetailsFlag(false)}}
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
                  placeholder="Detail of Emp"
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

              <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderEmpShowDetails()}</Scrollbar>
            </Dialog>
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
      </CustomPopover>

    </>
  );
}

EmpDetailsRow.propTypes = {
  row: PropTypes.object,
};

function applyFilter({ inputData, comparator, filters}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  // console.log('inputdata',inputData)
  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.emp_name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.emp_id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}