/* eslint-disable */
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import { Container, Grid, LinearProgress } from '@mui/material';
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
import { getComparator, TablePaginationCustom } from 'src/components/table';
import { useEffect, useState } from 'react';
import { _addressBooks, _bookings } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import { useVisitorContext } from 'src/context/visitor_context';
import DepartmentForm from './department-form';
import SearchBar from 'src/components/search/Search-bar';
import EditDepartmentForm from './edit-department-form';
import ShowDepartmentDetails from './show-department-details';
import { useAdminMISContext } from 'src/context/admin_mis_context';

// ----------------------------------------------------------------------
export default function DepartmentRender({
  title,
  subheader,
  tableLabels,
  tableData,
  isApiCalled,
  ...other
}) {
  const defaultFilters = {
    name: '',
  };
  const theme = useTheme();
  const { addVisitorFlag, setAddVisitorFlag } = useVisitorContext();
  const settings = useSettingsContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('company');
  const [filters, setFilters] = useState(defaultFilters);

  const onSort = (id) => {
    console.log('on sort called ');
    console.log('id is : ', id);
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filters,
  });
  const handleFilters = (name, value) => {
    console.log('name' + name, ' ', value);
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const renderDepartmentForm = () => {
    return (
      <>
        <DepartmentForm />
      </>
    );
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card {...other}>
        <Grid container justifyContent={'space-between'}>
          <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

          <Button
            sx={{ mt: 2.5, mr: 3 }}
            size="small"
            color="inherit"
            onClick={() => {
              setAddVisitorFlag(true);
            }}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            Add Department
          </Button>

          <Dialog
            fullWidth
            maxWidth="xl"
            // open={flag.value}
            open={addVisitorFlag}
            onClose={() => {
              setAddVisitorFlag(false);
            }}
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
                placeholder="Add Department"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderDepartmentForm()}</Scrollbar>
          </Dialog>

          <SearchBar
            filters={filters}
            onFilters={handleFilters}
            placeholder="Company, Department or Division"
          />
        </Grid>

        <TableContainer sx={{ overflow: 'unset' }}>
          {isApiCalled ? (
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={tableLabels}
                  order={order}
                  orderBy={orderBy}
                  onSort={onSort}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DepartmentDetailsRow key={row._id} row={row} />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          ) : (
            <LinearProgress />
          )}
        </TableContainer>

        <Divider sx={{ borderStyle: 'dashed' }} />

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

DepartmentRender.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function DepartmentDetailsRow({ row }) {
  console.log('row', row);
  const {
    setItemMasterId,
    editMasterFlag,
    setEditMasterFlag,
    showMasterFlag,
    setShowMasterFlag,
    deleteMasterFlag,
    setDeleteMasterFlag,
    
  } = useAdminMISContext();
  const handleDelete = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/department/${row._id}`;
      const res = await axios.delete(URL);
      popover.onClose();
      setDeleteMasterFlag(!deleteMasterFlag);

      alert('deleted successfully');
    } catch (err) {
      alert('not deleted');
      console.log(err);
    }
  };
  const theme = useTheme();

  const { deleteVisitorToggle, editVisitorFlag, setEditVisitorFlag } = useVisitorContext();
  const isLight = theme.palette.mode === 'light';

  const [currentUser, setCurrentUser] = useState(null);

  const popover = usePopover();
  // const flag = useBoolean(false);
  const {
    editFlag,
    addAccFlag,
    setAddAccFlag,
    showAccFlag,
    setShowAccFlag,
    setVisitorId,
    visitorId,
    showDetailsVisitorFlag,
    setShowDetailsVisitorFlag,
  } = useVisitorContext();
  // const [flag, setFlag] = useState(false);

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };
  const renderEditMaster = () => {
    return (
      <>
        <EditDepartmentForm />
      </>
    );
  };

  const renderShowDetails = () => {
    return (
      <>
        <ShowDepartmentDetails />
      </>
    );
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <ListItemText
            primary={row?.company}
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
            primary={row?.division}
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
            primary={row?.department}
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
        <MenuItem
          onClick={() => {
            setEditMasterFlag(true);
            setItemMasterId(row._id);
          }}
          sx={{ color: '#E29926' }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
          <Dialog
            fullWidth
            maxWidth="lg"
            // open={flag.value}
            open={editMasterFlag}
            onClose={() => {
              setEditMasterFlag(false);
            }}
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
                placeholder="Edit Department's details"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderEditMaster()}</Scrollbar>
          </Dialog>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setShowMasterFlag(true);
            setItemMasterId(row._id);
          }}
          sx={{ color: '#5865F2' }}
        >
          <Iconify icon="eva:file-fill" />
          Show Details
          <Dialog
            fullWidth
            maxWidth="sm"
            // open={flag.value}
            open={showMasterFlag}
            onClose={() => {
              setShowMasterFlag(false);
            }}
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
                placeholder="Detail of Department"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderShowDetails()}</Scrollbar>
          </Dialog>
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <Dialog
        fullWidth
        maxWidth="sm"
        // open={flag.value}
        open={showDetailsVisitorFlag}
        onClose={() => {
          setShowDetailsVisitorFlag(false);
        }}
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
            placeholder="Department Details"
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

        {/* <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderShowDetailsVisitor()}</Scrollbar> */}
      </Dialog>
      {/* </CustomPopover> */}
    </>
  );
}

DepartmentDetailsRow.propTypes = {
  row: PropTypes.object,
};

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  console.log(inputData);
  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.company.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.division.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.department.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
